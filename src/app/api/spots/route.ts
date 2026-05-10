import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    const type = searchParams.get("type");

    const where = type ? { type } : {};

    const spots = await prisma.spot.findMany({
      where,
      include: { _count: { select: { posts: true } } },
      orderBy: { rating: "desc" },
    });

    const result = spots.map((spot) => ({
      ...spot,
      fishSpecies: safeParseJson<string[]>(spot.fishSpecies, []),
      postCount: spot._count.posts,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch spots:", error);
    return NextResponse.json({ error: "获取钓点失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, latitude, longitude, type, fishSpecies, imageUrl } = body;

    if (!name || latitude === undefined || longitude === undefined || !type) {
      return NextResponse.json(
        { error: "名称、经纬度和类型为必填项" },
        { status: 400 }
      );
    }

    const spot = await prisma.spot.create({
      data: {
        name,
        description,
        latitude,
        longitude,
        type,
        fishSpecies: JSON.stringify(fishSpecies || []),
        imageUrl,
      },
    });

    return NextResponse.json(spot, { status: 201 });
  } catch (error) {
    console.error("Failed to create spot:", error);
    return NextResponse.json({ error: "创建钓点失败" }, { status: 500 });
  }
}
