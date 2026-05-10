import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateRecommendationScore, getDistanceKm } from "@/lib/recommend";
import { SpotType } from "@/types";

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
    const lat = parseFloat(searchParams.get("lat") || "39.9");
    const lng = parseFloat(searchParams.get("lng") || "116.4");
    const limit = parseInt(searchParams.get("limit") || "10");

    const spots = await prisma.spot.findMany({
      include: { _count: { select: { posts: true } } },
    });

    let weather = null;
    try {
      const weatherRes = await fetch(
        `${req.nextUrl.origin}/api/weather?lat=${lat}&lng=${lng}`
      );
      weather = await weatherRes.json();
    } catch {
      // Use default weather
    }

    const scoredSpots = spots.map((spot) => {
      const fishSpecies = safeParseJson<string[]>(spot.fishSpecies, []);
      const distance = getDistanceKm(lat, lng, spot.latitude, spot.longitude);
      const score = calculateRecommendationScore(
        { ...spot, fishSpecies, type: spot.type as SpotType, createdAt: spot.createdAt.toISOString() },
        distance,
        weather
      );
      return {
        ...spot,
        fishSpecies,
        distance: Math.round(distance * 10) / 10,
        score: Math.round(score * 100) / 100,
        postCount: spot._count.posts,
      };
    });

    scoredSpots.sort((a, b) => b.score - a.score);

    return NextResponse.json(scoredSpots.slice(0, limit));
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return NextResponse.json({ error: "获取推荐失败" }, { status: 500 });
  }
}
