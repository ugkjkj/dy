import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const where = type ? { type } : {};

  const spots = await prisma.spot.findMany({
    where,
    include: { _count: { select: { posts: true } } },
    orderBy: { rating: "desc" },
  });

  const result = spots.map((spot) => ({
    ...spot,
    fishSpecies: JSON.parse(spot.fishSpecies),
    postCount: spot._count.posts,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, latitude, longitude, type, fishSpecies, imageUrl } = body;

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
}
