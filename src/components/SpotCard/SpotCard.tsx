"use client";

import { Card, Tag, Rate, Space } from "antd";
import { EnvironmentOutlined, AimOutlined } from "@ant-design/icons";
import { Spot, SPOT_TYPE_LABELS, SpotType } from "@/types";

interface SpotCardProps {
  spot: Spot & { distance?: number; score?: number };
  onClick?: () => void;
}

export default function SpotCard({ spot, onClick }: SpotCardProps) {
  const typeColors: Record<SpotType, string> = {
    river: "blue",
    lake: "cyan",
    sea: "geekblue",
    reservoir: "green",
  };

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ marginBottom: 12 }}
      styles={{ body: { padding: "12px 16px" } }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>{spot.name}</span>
            <Tag color={typeColors[spot.type as SpotType]}>
              {SPOT_TYPE_LABELS[spot.type as SpotType]}
            </Tag>
          </div>

          {spot.description && (
            <div style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>
              {spot.description}
            </div>
          )}

          <Space size={16}>
            <span>
              <Rate disabled value={spot.rating} allowHalf style={{ fontSize: 12 }} />
              <span style={{ marginLeft: 4, color: "#999" }}>{spot.rating}</span>
            </span>

            {spot.distance !== undefined && (
              <span style={{ color: "#666", fontSize: 13 }}>
                <EnvironmentOutlined /> {spot.distance} km
              </span>
            )}

            <span style={{ color: "#666", fontSize: 13 }}>
              <AimOutlined /> {spot.fishSpecies?.slice(0, 3).join("、")}
              {spot.fishSpecies?.length > 3 && `等${spot.fishSpecies.length}种`}
            </span>
          </Space>
        </div>

        {spot.score !== undefined && (
          <div
            style={{
              background: "#52c41a",
              color: "white",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            {spot.score}
          </div>
        )}
      </div>
    </Card>
  );
}
