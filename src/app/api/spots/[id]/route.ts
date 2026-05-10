import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const spotId = parseInt(id);

    if (isNaN(spotId)) {
      return NextResponse.json({ error: "无效的钓点ID" }, { status: 400 });
    }

    const spot = await prisma.spot.findUnique({
      where: { id: spotId },
      include: { _count: { select: { posts: true } } },
    });

    if (!spot) {
      return NextResponse.json({ error: "钓点不存在" }, { status: 404 });
    }

    let fishSpecies: string[] = [];
    try {
      fishSpecies = JSON.parse(spot.fishSpecies);
    } catch {
      fishSpecies = [];
    }

    return NextResponse.json({
      ...spot,
      fishSpecies,
      postCount: spot._count.posts,
    });
  } catch (error) {
    console.error("Failed to fetch spot:", error);
    return NextResponse.json({ error: "获取钓点失败" }, { status: 500 });
  }
}
