import SpotDetailClient from "./SpotDetailClient";
import spotsData from "@/data/spots.json";

export function generateStaticParams() {
  return spotsData.map((spot) => ({
    id: spot.id.toString(),
  }));
}

export default function SpotDetailPage({ params }: { params: { id: string } }) {
  return <SpotDetailClient spotId={params.id} />;
}
