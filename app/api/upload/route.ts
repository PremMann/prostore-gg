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

        // If running on Vercel or a Blob token is provided, upload to Vercel Blob (persistent)
            if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
                try {
                    const blob = await put(key, file.stream(), {
                    access: "public",
                    contentType: file.type || "application/octet-stream",
                    addRandomSuffix: true,
                });
                return NextResponse.json({ message: "Success", status: 201, url: blob.url });
            } catch (error) {
                console.error("Error uploading to Vercel Blob:", error);
                return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
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
        } catch (error) {
            console.error("Error writing file locally:", error);
            return NextResponse.json({ error: "Failed to write file." }, { status: 500 });
        }
    } catch (error) {
        console.error("Error processing upload:", error);
        return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
    }
};
