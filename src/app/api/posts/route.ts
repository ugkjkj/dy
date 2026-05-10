import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spotId = searchParams.get("spotId");
  const limit = parseInt(searchParams.get("limit") || "20");
  const author = searchParams.get("author");

  const where: any = {};
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
    images: JSON.parse(post.images),
    spot: post.spot
      ? { ...post.spot, fishSpecies: JSON.parse(post.spot.fishSpecies) }
      : null,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
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
      images: JSON.parse(post.images),
      spot: post.spot
        ? { ...post.spot, fishSpecies: JSON.parse(post.spot.fishSpecies) }
        : null,
    },
    { status: 201 }
  );
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, likes } = body;

  if (!id) {
    return NextResponse.json({ error: "缺少帖子ID" }, { status: 400 });
  }

  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: { likes: { increment: 1 } },
  });

  return NextResponse.json(post);
}
