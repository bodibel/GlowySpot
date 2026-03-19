import { NextRequest, NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const isDev = process.env.NODE_ENV !== "production"
/* eslint-disable no-console */
const log = {
    info: (...args: unknown[]): void => { if (isDev) console.log(...args) },
    warn: (...args: unknown[]): void => { if (isDev) console.warn(...args) },
    error: (...args: unknown[]): void => { console.error(...args) },
}
/* eslint-enable no-console */

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Hitelesítés szükséges." }, { status: 401 })
    }
    if (!GEMINI_API_KEY) {
        log.warn("[UPLOAD] GEMINI_API_KEY is missing or empty.");
    }
    log.info("[UPLOAD] POST request received");
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            log.error("[UPLOAD] No file found in form data");
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        log.info(`[UPLOAD] Processing file: ${file.name} (${file.type}, ${file.size} bytes)`);
        const buffer = Buffer.from(await file.arrayBuffer());

        // --- 1. AI Content Moderation with Gemini ---
        if (!process.env.GEMINI_API_KEY) {
            log.warn("[UPLOAD] GEMINI_API_KEY is missing, skipping AI moderation (fail-open).");
        } else {
            log.info("[UPLOAD] Starting AI content moderation...");
            const MAX_RETRIES = 3;
            let retryCount = 0;
            let success = false;
            let lastError: any = null;

            while (retryCount < MAX_RETRIES && !success) {
                try {
                    const model = genAI.getGenerativeModel({
                        model: "gemini-2.0-flash",
                        safetySettings: [
                            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
                            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
                            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
                            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
                        ],
                    });

                    const prompt = `Analyze this image for a beauty-related social media platform. 
                    Respond ONLY with a JSON object in this format:
                    {
                      "isSafe": boolean, 
                      "isBeautyRelated": boolean,
                      "reason": "Hungarian explanation if rejected, otherwise empty string"
                    }
                    Rejection criteria: 
                    - isSafe = false if: Porn, Hentai, Gore, Violence, Illegal content, Nudity (even if non-pornographic nudity), or strong sexual poses.
                    - isBeautyRelated = false if: Irrelevant content (e.g., cars, empty landscapes, animals, unrelated objects).
                    Note: Close-up skin, hair, nails, hands, and feet ARE beauty-related and SAFE.`;

                    const result = await model.generateContent([
                        prompt,
                        { inlineData: { data: buffer.toString("base64"), mimeType: file.type } }
                    ]);

                    const finishReason = result.response.candidates?.[0]?.finishReason;
                    if (finishReason === "SAFETY") {
                        log.warn("[UPLOAD] Content blocked by Gemini safety filters");
                        return NextResponse.json(
                            { error: "A kép szexuális vagy nem biztonságos tartalmat hordoz, ezért elutasítva." },
                            { status: 400 }
                        );
                    }

                    const responseText = result.response.text();
                    log.info("[UPLOAD] Gemini response text:", responseText);
                    const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
                    const analysis = JSON.parse(cleanedJson);

                    if (!analysis.isSafe) {
                        log.warn(`[UPLOAD] Content rejected (safety): ${analysis.reason}`);
                        return NextResponse.json(
                            { error: analysis.reason || "A kép nem megengedett tartalmat hordoz." },
                            { status: 400 }
                        );
                    }

                    if (!analysis.isBeautyRelated) {
                        log.warn(`[UPLOAD] Content rejected (not beauty related): ${analysis.reason}`);
                        return NextResponse.json(
                            { error: analysis.reason || "A kép nem illik a szépségápolás témakörébe (pl. autó, tájkép, stb.)." },
                            { status: 400 }
                        );
                    }
                    
                    log.info("[UPLOAD] Content moderation passed");
                    success = true;
                } catch (aiError: any) {
                    lastError = aiError;
                    log.error(`[UPLOAD] Gemini retry ${retryCount + 1} failed:`, aiError?.message || aiError);
                    
                    if (aiError?.status === 429 || aiError?.message?.includes("429") || aiError?.message?.includes("quota")) {
                        retryCount++;
                        if (retryCount < MAX_RETRIES) {
                            const waitTime = Math.pow(2, retryCount) * 1000;
                            await new Promise(resolve => setTimeout(resolve, waitTime));
                        }
                    } else {
                        break;
                    }
                }
            }

            if (!success) {
                log.error("[UPLOAD] AI moderation failed after retries or non-retryable error. FAILING OPEN to allow user progress.");
                // We allow the upload to proceed even if AI moderation fails due to rate limits or errors
                // This ensures the site remains functional for the user.
            }
        }

        // --- 2. Convert to WebP & Save ---
        const relativeUploadDir = "/uploads";
        const uploadDir = process.env.UPLOAD_DIR
            ? join(process.env.UPLOAD_DIR, relativeUploadDir)
            : join(process.cwd(), "public", relativeUploadDir);
        log.info(`[UPLOAD] Saving file to: ${uploadDir}`);

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            log.info("[UPLOAD] Directory already exists or error creating it (non-fatal)");
        }

        const timestamp = Date.now();
        const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9.-]/g, "");
        const filename = `${timestamp}-${originalName}.webp`;
        const filepath = join(uploadDir, filename);

        log.info(`[UPLOAD] Processing image with sharp to: ${filepath}`);
        await sharp(buffer)
            .webp({ quality: 80 })
            .toFile(filepath);

        log.info("[UPLOAD] File saved successfully");
        const fileUrl = `/api/files/${filename}`;
        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        log.error("[UPLOAD] UNHANDLED ERROR:", error);
        return NextResponse.json(
            { error: "Rendszerhiba a feltöltés során." },
            { status: 500 }
        );
    }
}
