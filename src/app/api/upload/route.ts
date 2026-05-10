import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "没有文件" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "只支持 JPG, PNG, GIF, WebP 格式" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "文件大小不能超过 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}-${random}.${ext}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Directory already exists
    }

    // Write file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "上传失败，请重试" },
      { status: 500 }
    );
  }
}
