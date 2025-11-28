# BeautyGram - Szépségipari Social Marketplace

BeautyGram egy modern, szépségipari "social marketplace" webalkalmazás, amely összeköti a szépségipari szolgáltatókat (fodrászok, körmösök, kozmetikusok, barberok) a vendégekkel. Az alkalmazás ötvözi a közösségi média (Instagram-szerű feed) és a szolgáltatáskeresők (térképes/lokáció alapú keresés, időpontfoglalás) funkcióit.

## 🚀 Technológiai Stack

- **Frontend**: React 18 (TypeScript)
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3.x
- **Backend/Database**: Google Firebase v9 (Modular SDK)
  - Firebase Authentication (Email/Password)
  - Cloud Firestore (NoSQL adatbázis)
- **Icons**: Lucide React
- **Egyéb**: Base64 fájlkezelés, Haversine formula távolságszámításhoz

## 🎨 Design & UI/UX

- **Színvilág**: Rózsaszín dominancia (rose-600 primary)
- **Formavilág**: Kerekített sarkok (rounded-2xl, rounded-3xl), modern kártyák
- **Navigáció**:
  - Desktop: Fix bal oldali Sidebar
  - Mobile: Alsó navigációs sáv + felső fejléc
- **Scrollbar**: Egyedi, vékonyított scrollbar stílusok

## 👥 Felhasználói Szerepkörök

1. **Vendég (Client)**: Keresés, foglalás, értékelés, kedvencek
2. **Szolgáltató (Provider)**: Szalon kezelés, szolgáltatások, posztolás
3. **Admin**: Rendszer felügyelet, felhasználók és szalonok kezelése

## 📁 Projekt Struktúra

```
src/
├── components/
│   ├── auth/           # Bejelentkezés, Regisztráció
│   ├── common/         # Újrafelhasználható UI komponensek
│   ├── layout/         # Layout komponensek (Sidebar, Header, stb.)
│   ├── salon/          # Szalon specifikus komponensek
│   └── dashboard/      # Dashboard komponensek
├── contexts/           # React Contexts (Auth)
├── hooks/              # Custom Hooks
├── lib/                # Firebase konfiguráció és segédfüggvények
├── pages/              # Oldal komponensek
├── types/              # TypeScript típusdefiníciók
├── utils/              # Segédfüggvények
└── assets/             # Statikus fájlok
```

## 🔧 Telepítés és Futtatás

### Előfeltételek

- Node.js (v18 vagy újabb)
- npm vagy yarn

### 1. Függőségek telepítése

```bash
npm install
```

### 2. Firebase konfiguráció

Másolja a `.env.example` fájlt `.env` néven, és töltse ki a Firebase projekt adataival:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Fejlesztői szerver indítása

```bash
npm run dev
```

A projekt elérhető lesz a `http://localhost:5173` címen.

### 4. Production build

```bash
npm run build
```

A build fájlok a `dist/` mappába kerülnek.

## 📄 Főbb Funkciók

### Publikus oldalak

- **Főoldal**: Instagram-szerű feed, keresés, szűrés kategóriák szerint
- **Szalon Profil**: Részletes szalon információk, szolgáltatások, vélemények

### Védett oldalak (Bejelentkezés szükséges)

#### Vendégeknek (Client)
- Foglalásaim kezelése
- Kedvenc szalonok
- Profil beállítások

#### Szolgáltatóknak (Provider)
- Dashboard statisztikákkal
- Szalon adatok szerkesztése
- Szolgáltatások kezelése
- Nyitvatartás beállítása
- Posztok létrehozása

## 🔐 Autentikáció

Az alkalmazás Firebase Authentication-t használ:
- Email/Jelszó alapú regisztráció
- Bejelentkezés
- Szerepkör alapú hozzáférés vezérlés
- Protected Routes

## 🗄️ Adatstruktúra

### User
- id, name, email, role, avatar, status

### Salon
- id, ownerId, name, address, coordinates, categories, services, openingHours, images

### Post
- id, salonId, imageUrl, description, serviceCategory, location, coordinates

### Review
- id, salonId, userId, rating, comment

### Booking
- id, salonId, userId, serviceId, date, startTime, endTime, status

## 🛠️ Hasznos Parancsok

```bash
# Fejlesztés
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## 📝 Következő Lépések

A projekt jelenleg az alapvető struktúrával és funkcionalitással rendelkezik. További fejlesztési lehetőségek:

1. **Szalon profil bővítése**: Tab rendszer implementálása (Posztok, Áttekintés, Szolgáltatások, Galéria, Vélemények)
2. **Dashboard funkciók**: Teljes szalon kezelés, szolgáltatások CRUD, nyitvatartás kezelés
3. **Foglalási rendszer**: Időpontfoglalás implementálása
4. **Keresés fejlesztése**: Geolokáció integráció, térképes keresés
5. **Értékelési rendszer**: Vélemények írása és megjelenítése
6. **Admin felület**: Felhasználók és szalonok kezelése
7. **Képfeltöltés**: Firebase Storage integráció
8. **Valós idejű értesítések**: Firebase Cloud Messaging
9. **Chat rendszer**: Vendégek és szolgáltatók közötti kommunikáció

## 📱 Reszponzív Design

Az alkalmazás teljes mértékben reszponzív:
- Mobile: Bottom Navigation + Header
- Tablet/Desktop: Sidebar Navigation

## 🎯 Biztonsági Követelmények

- Firebase Security Rules beállítása
- Adatvalidáció client és server oldalon
- Szerepkör alapú hozzáférés vezérlés
- XSS és CSRF védelem

## 📄 Licenc

MIT

## 👨‍💻 Fejlesztés

Ez a projekt a BeautyGram szépségipari marketplace prototípusa, amely demonstrálja a modern React/Firebase alkalmazásfejlesztést TypeScript-tel.
