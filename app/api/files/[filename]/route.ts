import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;
    
    // Sanitize filename - only allow safe filenames
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");
    if (!safeFilename || safeFilename !== filename) {
        return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }
    
    const filePath = process.env.UPLOAD_DIR
        ? join(process.env.UPLOAD_DIR, "uploads", safeFilename)
        : join(process.cwd(), "public", "uploads", safeFilename);
    
    if (!existsSync(filePath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    
    try {
        const fileBuffer = await readFile(filePath);
        const ext = safeFilename.split(".").pop()?.toLowerCase();
        
        const mimeTypes: Record<string, string> = {
            webp: "image/webp",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
        };
        
        const contentType = mimeTypes[ext || ""] || "application/octet-stream";
        
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return NextResponse.json({ error: "Error reading file" }, { status: 500 });
    }
}
