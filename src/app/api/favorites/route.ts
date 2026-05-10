import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// In-memory favorites store (in production, use database)
const favorites = new Map<string, Set<number>>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "default";

  const userFavorites = favorites.get(userId) || new Set();

  // Get favorite spots
  if (userFavorites.size === 0) {
    return NextResponse.json([]);
  }

  const spots = await prisma.spot.findMany({
    where: { id: { in: Array.from(userFavorites) } },
    include: { _count: { select: { posts: true } } },
  });

  const result = spots.map((spot) => ({
    ...spot,
    fishSpecies: JSON.parse(spot.fishSpecies),
    postCount: spot._count.posts,
    isFavorite: true,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId = "default", spotId, action } = body;

  if (!spotId) {
    return NextResponse.json({ error: "缺少钓点ID" }, { status: 400 });
  }

  if (!favorites.has(userId)) {
    favorites.set(userId, new Set());
  }

  const userFavorites = favorites.get(userId)!;

  if (action === "add") {
    userFavorites.add(spotId);
  } else if (action === "remove") {
    userFavorites.delete(spotId);
  } else {
    // Toggle
    if (userFavorites.has(spotId)) {
      userFavorites.delete(spotId);
    } else {
      userFavorites.add(spotId);
    }
  }

  return NextResponse.json({
    spotId,
    isFavorite: userFavorites.has(spotId),
    totalFavorites: userFavorites.size,
  });
}
