import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { put } from "@vercel/blob";

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No files received." }, { status: 400 });
        }

        const safeName = file.name.replace(/\s+/g, "_");
        const key = `uploads/${Date.now()}_${safeName}`;

        // If running on Vercel or a Blob token is provided, try Vercel Blob first
        if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                const buffer = Buffer.from(await file.arrayBuffer());
                const blob = await put(key, buffer, {
                    access: "public",
                    contentType: file.type || "application/octet-stream",
                    addRandomSuffix: true,
                });
                return NextResponse.json({ message: "Success", status: 201, url: blob.url });
            } catch (error: any) {
                console.error("Error uploading to Vercel Blob:", error);
                // If not running on Vercel (e.g. local dev), fallback to local file writing
                if (!process.env.VERCEL) {
                    console.warn("Vercel Blob upload failed on localhost. Falling back to local upload.");
                } else {
                    return NextResponse.json({ error: `Vercel Blob failed: ${error?.message || error}` }, { status: 500 });
                }
            }
        }

        // Development fallback: write to local /public/uploads
        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadDir = path.join(process.cwd(), "public/uploads");
            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir, { recursive: true });
            }
            await writeFile(path.join(uploadDir, path.basename(key)), buffer);
            return NextResponse.json({ message: "Success", status: 201, url: `/uploads/${path.basename(key)}` });
        } catch (error: any) {
            console.error("Error writing file locally:", error);
            return NextResponse.json({ error: `Failed to write file locally: ${error?.message || error}` }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Error processing upload:", error);
        return NextResponse.json({ error: `Failed to process request: ${error?.message || error}` }, { status: 500 });
    }
};
