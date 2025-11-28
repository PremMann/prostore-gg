import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No files received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        try {
            await writeFile(
                path.join(uploadDir, filename),
                buffer
            );
            return NextResponse.json({
                message: "Success",
                status: 201,
                url: `/uploads/${filename}`
            });
        } catch (error) {
            console.error("Error writing file:", error);
            return NextResponse.json({ error: "Failed to write file." }, { status: 500 });
        }
    } catch (error) {
        console.error("Error processing upload:", error);
        return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
    }
};
