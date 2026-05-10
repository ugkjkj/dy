import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

function safeParseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const spotId = searchParams.get("spotId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const author = searchParams.get("author");

    const where: Prisma.PostWhereInput = {};
    if (spotId) where.spotId = parseInt(spotId);
    if (author) where.author = author;

    const posts = await prisma.post.findMany({
      where,
      include: { spot: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const result = posts.map((post) => ({
      ...post,
      images: safeParseJson<string[]>(post.images, []),
      spot: post.spot
        ? { ...post.spot, fishSpecies: safeParseJson<string[]>(post.spot.fishSpecies, []) }
        : null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "获取帖子失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, images, spotId, author, fishType, weight } = body;

    if (!title || !content || !spotId) {
      return NextResponse.json(
        { error: "标题、内容和钓点为必填项" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        images: JSON.stringify(images || []),
        spotId,
        author: author || "匿名钓友",
        fishType,
        weight,
      },
      include: { spot: true },
    });

    return NextResponse.json(
      {
        ...post,
        images: safeParseJson<string[]>(post.images, []),
        spot: post.spot
          ? { ...post.spot, fishSpecies: safeParseJson<string[]>(post.spot.fishSpecies, []) }
          : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "缺少帖子ID" }, { status: 400 });
    }

    const postId = parseInt(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的帖子ID" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
