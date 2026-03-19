# Security & Code Quality Fixes – Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all critical security vulnerabilities (IDOR, missing auth, enumeration) and serious stability/code-quality issues found during the audit.

**Architecture:** The fixes are organized in dependency order: shared auth utility first, then consumer files. No new dependencies are needed – only `next-auth`'s `getServerSession` and Prisma transactions already in the project. There are no automated tests in the codebase, so each task ends with a manual verification checklist instead of `npm test`.

**Tech Stack:** Next.js 15 App Router, Server Actions (`"use server"`), NextAuth.js 4 (`getServerSession`), Prisma ORM, PostgreSQL, TypeScript.

---

## Background: What is a Server Action?

Next.js Server Actions (`"use server"` files) execute on the server but are callable from the client. They are **not protected by middleware** – authorization must be performed inside each function. That is why all mutations that are currently missing session checks are exploitable: an attacker can call them directly via a POST to the action endpoint with forged parameters.

---

## Task 1: Create a shared auth utility

**Why first:** Every subsequent task depends on this helper.

**Files:**
- Create: `lib/auth-utils.ts`

**Step 1: Create the file**

```ts
// lib/auth-utils.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

/**
 * Returns the session user id, or throws an error if not authenticated.
 * Use this at the start of every server action that requires login.
 */
export async function requireSession(): Promise<string> {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error("Hitelesítés szükséges.")
    }
    return session.user.id
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors related to `lib/auth-utils.ts`.

**Step 3: Commit**

```bash
git add lib/auth-utils.ts
git commit -m "feat: add requireSession auth utility"
```

---

## Task 2: Fix IDOR in user mutations (`lib/actions/user.ts`)

**Problem:** `updateProfile`, `inactivateAccount`, `restoreAccount` accept `userId` with no session check. Any caller can modify any user.

**Files:**
- Modify: `lib/actions/user.ts`

**Step 1: Add the import at the top of the file (after existing imports)**

```ts
import { requireSession } from "@/lib/auth-utils"
```

**Step 2: Replace `updateProfile`**

Old (lines 20–34):
```ts
export async function updateProfile(userId: string, data: { name?: string }) {
    try {
        const user = await prisma.user.update({
```

New:
```ts
export async function updateProfile(userId: string, data: { name?: string }) {
    const sessionUserId = await requireSession()
    if (sessionUserId !== userId) {
        throw new Error("Nincs jogosultságod ezt a profilt módosítani.")
    }
    try {
        const user = await prisma.user.update({
```

**Step 3: Replace `inactivateAccount`**

Add after `export async function inactivateAccount(userId: string) {`:
```ts
    const sessionUserId = await requireSession()
    if (sessionUserId !== userId) {
        throw new Error("Nincs jogosultságod ezt a fiókot inaktiválni.")
    }
```

**Step 4: Replace `restoreAccount`**

Add after `export async function restoreAccount(userId: string) {`:
```ts
    const sessionUserId = await requireSession()
    if (sessionUserId !== userId) {
        throw new Error("Nincs jogosultságod ezt a fiókot visszaállítani.")
    }
```

**Step 5: Manual verification checklist**
- [ ] Log in as User A, try to call `updateProfile` with User B's ID → should throw "Nincs jogosultságod..."
- [ ] Unauthenticated call → should throw "Hitelesítés szükséges."

**Step 6: Commit**

```bash
git add lib/actions/user.ts
git commit -m "fix: require session ownership check in user mutations"
```

---

## Task 3: Add ownership checks to salon mutations (`lib/actions/salon.ts`)

**Problem:** `updateSalon`, `createPost`, `updatePost`, `deletePost`, `createService`, `updateService`, `deleteService`, `saveOpeningHours`, `createClosedDate`, `deleteClosedDate` accept IDs with no ownership verification.

**Files:**
- Modify: `lib/actions/salon.ts`

### Step 1: Add auth-utils import (top of file, after existing imports)

```ts
import { requireSession } from "@/lib/auth-utils"
```

### Step 2: Add a private ownership helper (add after imports, before first export)

```ts
/**
 * Verifies the session user owns the given salon.
 * Throws if not owner or not authenticated.
 */
async function requireSalonOwner(salonId: string): Promise<string> {
    const sessionUserId = await requireSession()
    const salon = await prisma.salon.findUnique({
        where: { id: salonId },
        select: { ownerId: true }
    })
    if (!salon) throw new Error("A szalon nem található.")
    if (salon.ownerId !== sessionUserId) throw new Error("Nincs jogosultságod ehhez a szalonhoz.")
    return sessionUserId
}

/**
 * Verifies the session user owns the salon that contains the given post.
 */
async function requirePostOwner(postId: string): Promise<void> {
    const sessionUserId = await requireSession()
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { salon: { select: { ownerId: true } } }
    })
    if (!post) throw new Error("A bejegyzés nem található.")
    if (post.salon.ownerId !== sessionUserId) throw new Error("Nincs jogosultságod ehhez a bejegyzéshez.")
}

/**
 * Verifies the session user owns the salon that contains the given service.
 */
async function requireServiceOwner(serviceId: string): Promise<void> {
    const sessionUserId = await requireSession()
    const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: { salon: { select: { ownerId: true } } }
    })
    if (!service) throw new Error("A szolgáltatás nem található.")
    if (service.salon.ownerId !== sessionUserId) throw new Error("Nincs jogosultságod ehhez a szolgáltatáshoz.")
}
```

### Step 3: Guard `updateSalon`

Add as first line inside `updateSalon(salonId, data)`:
```ts
await requireSalonOwner(salonId)
```

### Step 4: Guard `createSalon`

Add as first line inside `createSalon(data)`:
```ts
const sessionUserId = await requireSession()
if (data.ownerId !== sessionUserId) throw new Error("Nincs jogosultságod más nevében szalont létrehozni.")
```

### Step 5: Guard `createService`

Add as first line inside `createService(data)`:
```ts
await requireSalonOwner(data.salonId)
```

### Step 6: Guard `updateService`

Add as first line inside `updateService(serviceId, data)`:
```ts
await requireServiceOwner(serviceId)
```

### Step 7: Guard `deleteService`

Add as first line inside `deleteService(serviceId)`:
```ts
await requireServiceOwner(serviceId)
```

### Step 8: Guard `saveOpeningHours`

Add as first line inside `saveOpeningHours(salonId, hours)`:
```ts
await requireSalonOwner(salonId)
```

### Step 9: Guard `createClosedDate`

Add as first line inside `createClosedDate(data)`:
```ts
await requireSalonOwner(data.salonId)
```

### Step 10: Guard `deleteClosedDate`

For `deleteClosedDate(id)`, need to look up the salonId first. Replace:
```ts
export async function deleteClosedDate(id: string) {
    return await prisma.closedDate.delete({ where: { id } })
}
```
With:
```ts
export async function deleteClosedDate(id: string) {
    const sessionUserId = await requireSession()
    const closedDate = await prisma.closedDate.findUnique({
        where: { id },
        select: { salon: { select: { ownerId: true } } }
    })
    if (!closedDate) throw new Error("A zárt nap nem található.")
    if (closedDate.salon.ownerId !== sessionUserId) throw new Error("Nincs jogosultságod ehhez a szalonhoz.")
    return await prisma.closedDate.delete({ where: { id } })
}
```

### Step 11: Guard `createPost`

Add as first line inside `createPost(data)`:
```ts
await requireSalonOwner(data.salonId)
```

### Step 12: Guard `updatePost`

Add as first line inside `updatePost(postId, data)`:
```ts
await requirePostOwner(postId)
```

### Step 13: Guard `deletePost`

Add as first line inside `deletePost(postId)`:
```ts
await requirePostOwner(postId)
```

### Step 14: Manual verification checklist
- [ ] Logged-in provider can update their own salon → OK
- [ ] Logged-in provider cannot update another provider's salon → throws error
- [ ] Unauthenticated call to `deletePost` → throws "Hitelesítés szükséges."

### Step 15: Commit

```bash
git add lib/actions/salon.ts
git commit -m "fix: add ownership checks to all salon/post/service mutations"
```

---

## Task 4: Fix `sendMessage` sender spoofing (`lib/actions/salon.ts`)

**Problem:** The caller supplies `data.senderId` which is not verified against the session.

**Files:**
- Modify: `lib/actions/salon.ts`

**Step 1: Replace sender verification inside `sendMessage`**

Old (lines 490–497):
```ts
// 1. Verify Sender
const sender = await prisma.user.findUnique({
    where: { id: data.senderId },
    select: { role: true }
})

if (!sender) {
    throw new Error("Csak bejelentkezett felhasználók küldhetnek üzenetet!")
}
```

New:
```ts
// 1. Verify Sender matches session
const sessionUserId = await requireSession()
if (data.senderId !== sessionUserId) {
    throw new Error("Nem küldhetsz üzenetet más nevében.")
}
```

**Step 2: Commit**

```bash
git add lib/actions/salon.ts
git commit -m "fix: validate sendMessage sender against session user"
```

---

## Task 5: Fix `toggleLike`, `addComment`, `markMessageAsRead` (`lib/actions/salon.ts`)

**Problem:** These accept `userId` parameters without session verification.

**Files:**
- Modify: `lib/actions/salon.ts`

### Step 1: Fix `toggleLike`

Add as first line inside `toggleLike(postId, userId)`:
```ts
const sessionUserId = await requireSession()
if (sessionUserId !== userId) throw new Error("Nincs jogosultságod ezt a műveletet elvégezni.")
```

### Step 2: Fix `addComment`

Add as first line inside `addComment(postId, userId, content)`:
```ts
const sessionUserId = await requireSession()
if (sessionUserId !== userId) throw new Error("Nincs jogosultságod kommentelni más nevében.")
```

### Step 3: Fix `markMessageAsRead`

Replace `markMessageAsRead`:
```ts
export async function markMessageAsRead(messageId: string) {
    const sessionUserId = await requireSession()
    const message = await prisma.message.findUnique({
        where: { id: messageId },
        select: { receiverId: true }
    })
    if (!message) throw new Error("Az üzenet nem található.")
    if (message.receiverId !== sessionUserId) throw new Error("Nincs jogosultságod ezt az üzenetet olvasottnak jelölni.")
    const updated = await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true }
    })
    revalidatePath("/dashboard/messages")
    return updated
}
```

**Step 4: Commit**

```bash
git add lib/actions/salon.ts
git commit -m "fix: verify session identity in toggleLike, addComment, markMessageAsRead"
```

---

## Task 6: Add authentication to the upload endpoint

**Problem:** `POST /api/upload` has no authentication – anyone can upload files.

**Files:**
- Modify: `app/api/upload/route.ts`

**Step 1: Add session import at the top**

```ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
```

**Step 2: Add auth check as the first thing inside the `POST` handler (before `formData`)**

```ts
const session = await getServerSession(authOptions)
if (!session?.user?.id) {
    return NextResponse.json({ error: "Hitelesítés szükséges." }, { status: 401 })
}
```

**Step 3: Manual verification**
- [ ] Upload as logged-in user → succeeds (same as before)
- [ ] Upload without cookie/session → 401 response

**Step 4: Commit**

```bash
git add app/api/upload/route.ts
git commit -m "fix: require authenticated session for file uploads"
```

---

## Task 7: Fix login user enumeration

**Problem:** Different error messages for "user not found" vs "wrong password" allow username enumeration.

**Files:**
- Modify: `app/api/auth/[...nextauth]/route.ts`

**Step 1: Unify the error message**

Old (lines 26–33):
```ts
if (!user || !user.password) {
    throw new Error("Invalid credentials")
}
const isValid = await bcrypt.compare(credentials.password, user.password)
if (!isValid) {
    throw new Error("Hibás jelszó!")
}
```

New:
```ts
if (!user || !user.password) {
    throw new Error("Hibás email cím vagy jelszó.")
}
const isValid = await bcrypt.compare(credentials.password, user.password)
if (!isValid) {
    throw new Error("Hibás email cím vagy jelszó.")
}
```

**Step 2: Commit**

```bash
git add "app/api/auth/[...nextauth]/route.ts"
git commit -m "fix: unify login error messages to prevent user enumeration"
```

---

## Task 8: Fix DB connection pool outside singleton (`lib/db.ts`)

**Problem:** `new Pool(...)` runs at module-level on every import. During Next.js dev hot-reload, each reload creates a new pool without cleaning up the old one, causing connection leaks.

**Files:**
- Modify: `lib/db.ts`

**Step 1: Move the pool inside the singleton factory**

Replace entire file with:
```ts
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

type PrismaClientSingleton = PrismaClient

const globalForPrisma = globalThis as unknown as {
    prisma_final: PrismaClientSingleton | undefined
}

function createPrismaClient(): PrismaClientSingleton {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma_final ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma_final = prisma
}

export default prisma
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add lib/db.ts
git commit -m "fix: move connection pool inside Prisma singleton to prevent dev hot-reload leaks"
```

---

## Task 9: Fix session callback N+1 DB query

**Problem:** The `session` callback fetches the user from the DB on every session read. The `jwt` callback should enrich the token once (at login), then the session callback reads from the token.

**Files:**
- Modify: `app/api/auth/[...nextauth]/route.ts`

**Step 1: Enrich token at login time in `jwt` callback**

Replace the `jwt` callback (lines 96–101):
```ts
async jwt({ token, user }: any) {
    if (user) {
        token.sub = user.id
    }
    return token
}
```

New:
```ts
async jwt({ token, user, trigger }: any) {
    if (user) {
        // Initial login – persist role and name in token
        token.sub = user.id
        token.role = user.role
        token.name = user.name
    }
    if (trigger === "update") {
        // Re-fetch on explicit session update (e.g. profile change)
        const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true, name: true }
        })
        if (dbUser) {
            token.role = dbUser.role
            token.name = dbUser.name
        }
    }
    return token
}
```

**Step 2: Read from token in `session` callback instead of DB**

Replace the `session` callback (lines 84–95):
```ts
async session({ session, token }: any) {
    if (token.sub && session.user) {
        session.user.id = token.sub
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } })
        if (dbUser) {
            session.user.name = dbUser.name;
            session.user.email = dbUser.email;
            (session.user as any).role = dbUser.role;
        }
    }
    return session
}
```

New:
```ts
async session({ session, token }: any) {
    if (token.sub && session.user) {
        session.user.id = token.sub;
        (session.user as any).role = token.role;
        session.user.name = token.name;
    }
    return session
}
```

> **Note:** After this change, if a user's role or name is changed by an admin, the currently logged-in user's session won't reflect it until they log out and back in (or until `trigger === "update"` is sent). This is standard JWT behaviour and is acceptable.

**Step 3: Manual verification**
- [ ] Log in → `session.user.role` is populated correctly
- [ ] Check server logs – no DB query should appear on repeated page navigations (only on first login)

**Step 4: Commit**

```bash
git add "app/api/auth/[...nextauth]/route.ts"
git commit -m "perf: move user data into JWT token to avoid per-request DB query in session callback"
```

---

## Task 10: Wrap `inactivateAccount` and `restoreAccount` in transactions

**Problem:** The multi-step inactivation/restoration is not atomic. A partial failure leaves data inconsistent.

**Files:**
- Modify: `lib/actions/user.ts`

**Step 1: Wrap `inactivateAccount` in a transaction**

Replace the try-block body of `inactivateAccount`:
```ts
const now = new Date()
await prisma.$transaction(async (tx) => {
    await tx.user.update({
        where: { id: userId },
        data: { isActive: false, inactivatedAt: now }
    })
    await tx.salon.updateMany({
        where: { ownerId: userId },
        data: { isActive: false, inactivatedAt: now }
    })
    const salons = await tx.salon.findMany({
        where: { ownerId: userId },
        select: { id: true }
    })
    const salonIds = salons.map(s => s.id)
    if (salonIds.length > 0) {
        await tx.post.updateMany({
            where: { salonId: { in: salonIds } },
            data: { isActive: false, inactivatedAt: now }
        })
    }
})
```

**Step 2: Wrap `restoreAccount` in a transaction**

Replace the try-block body of `restoreAccount`:
```ts
await prisma.$transaction(async (tx) => {
    await tx.user.update({
        where: { id: userId },
        data: { isActive: true, inactivatedAt: null }
    })
    await tx.salon.updateMany({
        where: { ownerId: userId },
        data: { isActive: true, inactivatedAt: null }
    })
    const salons = await tx.salon.findMany({
        where: { ownerId: userId },
        select: { id: true }
    })
    const salonIds = salons.map(s => s.id)
    if (salonIds.length > 0) {
        await tx.post.updateMany({
            where: { salonId: { in: salonIds } },
            data: { isActive: true, inactivatedAt: null }
        })
    }
})
```

**Step 3: Commit**

```bash
git add lib/actions/user.ts
git commit -m "fix: wrap inactivate/restore account in DB transactions for atomicity"
```

---

## Task 11: Fix `(prisma as any)` casts in `lib/actions/category.ts`

**Problem:** The `Category` model was added via Prisma migration but `prisma generate` was never run, so TypeScript doesn't know about it. The `(prisma as any)` workaround hides all type errors.

**Files:**
- Modify: `lib/actions/category.ts`

**Step 1: Regenerate Prisma client**

```bash
npx prisma generate
```

**Step 2: Remove all `(prisma as any)` casts**

In `category.ts`, replace every occurrence of `(prisma as any).category` with `prisma.category`. There are 4 occurrences (lines 9, 22, 42, 59).

**Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no type errors in `category.ts`.

**Step 4: Commit**

```bash
git add lib/actions/category.ts
git commit -m "fix: regenerate Prisma client and remove (prisma as any) casts in category actions"
```

---

## Task 12: Fix hardcoded `/app/public` path

**Problem:** `join("/app/public", ...)` only works inside Docker. In development the path should be `process.cwd() + "/public"`.

**Files:**
- Modify: `app/api/upload/route.ts`
- Modify: `app/api/files/[filename]/route.ts`

**Step 1: Fix `upload/route.ts` (line 123)**

Old:
```ts
const uploadDir = join("/app/public", relativeUploadDir);
```

New:
```ts
const uploadDir = join(process.env.UPLOAD_DIR ?? process.cwd(), "public", relativeUploadDir);
```

**Step 2: Fix `files/[filename]/route.ts` (line 18)**

Old:
```ts
const filePath = join("/app/public/uploads", safeFilename);
```

New:
```ts
const filePath = join(process.env.UPLOAD_DIR ?? process.cwd(), "public", "uploads", safeFilename);
```

**Step 3: Add `UPLOAD_DIR=/app` to production `.env.production.example`**

Open `.env.production.example` and add:
```
# Set to /app for Docker deployments, leave unset for local dev
UPLOAD_DIR=/app
```

**Step 4: Commit**

```bash
git add app/api/upload/route.ts "app/api/files/[filename]/route.ts" .env.production.example
git commit -m "fix: replace hardcoded /app/public path with env-configurable UPLOAD_DIR"
```

---

## Task 13: Replace production console.log calls with conditional logging

**Problem:** `app/api/upload/route.ts` has 20+ `console.log` calls that leak filenames, paths, and API responses in production.

**Files:**
- Modify: `app/api/upload/route.ts`

**Step 1: Add a dev-only logger at the top of the file (after imports)**

```ts
const isDev = process.env.NODE_ENV !== "production"
const log = {
    info: (...args: unknown[]) => { if (isDev) console.log(...args) },
    warn: (...args: unknown[]) => { if (isDev) console.warn(...args) },
    error: (...args: unknown[]) => console.error(...args), // always log errors
}
```

**Step 2: Replace all `console.log(...)` with `log.info(...)`, `console.warn` with `log.warn`, keep `console.error` as `log.error`**

Go through the file and replace:
- `console.log(...)` → `log.info(...)`
- `console.warn(...)` → `log.warn(...)`
- `console.error(...)` → `log.error(...)`

**Step 3: Commit**

```bash
git add app/api/upload/route.ts
git commit -m "fix: suppress verbose console.log output in production uploads"
```

---

## Summary of Changes

| Task | File(s) | Type |
|------|---------|------|
| 1 | `lib/auth-utils.ts` (new) | Security |
| 2 | `lib/actions/user.ts` | Security – IDOR |
| 3 | `lib/actions/salon.ts` | Security – IDOR |
| 4 | `lib/actions/salon.ts` | Security – spoofing |
| 5 | `lib/actions/salon.ts` | Security – auth |
| 6 | `app/api/upload/route.ts` | Security – unauth upload |
| 7 | `app/api/auth/[...nextauth]/route.ts` | Security – enumeration |
| 8 | `lib/db.ts` | Stability – connection leak |
| 9 | `app/api/auth/[...nextauth]/route.ts` | Performance – N+1 |
| 10 | `lib/actions/user.ts` | Stability – atomicity |
| 11 | `lib/actions/category.ts` | Code quality – types |
| 12 | `app/api/upload/route.ts`, `app/api/files/[filename]/route.ts` | Portability |
| 13 | `app/api/upload/route.ts` | Code quality – logging |
