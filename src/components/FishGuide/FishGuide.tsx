"use client";

import { Card, Tag, Collapse } from "antd";
import { FISH_DATABASE, FishInfo } from "@/types";

interface FishGuideProps {
  species?: string[];
}

const difficultyColors = {
  easy: "green",
  medium: "orange",
  hard: "red",
};

const difficultyLabels = {
  easy: "新手友好",
  medium: "需要经验",
  hard: "高手挑战",
};

function FishItem({ fish }: { fish: FishInfo }) {
  return (
    <div style={{ padding: "4px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{fish.name}</span>
          <span style={{ color: "#999", fontSize: 12, marginLeft: 8 }}>{fish.species}</span>
        </div>
        <Tag color={difficultyColors[fish.difficulty]}>
          {difficultyLabels[fish.difficulty]}
        </Tag>
      </div>

      <p style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>{fish.description}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
        <div>
          <span style={{ color: "#999" }}>适钓鱼饵：</span>
          <span>{fish.bait.join("、")}</span>
        </div>
        <div>
          <span style={{ color: "#999" }}>钓法：</span>
          <span>{fish.methods.join("、")}</span>
        </div>
        <div>
          <span style={{ color: "#999" }}>最佳水温：</span>
          <span>{fish.bestTemp}</span>
        </div>
        <div>
          <span style={{ color: "#999" }}>最佳时段：</span>
          <span>{fish.bestTime}</span>
        </div>
      </div>
    </div>
  );
}

export default function FishGuide({ species }: FishGuideProps) {
  const fishList = species
    ? FISH_DATABASE.filter((f) => species.includes(f.name))
    : FISH_DATABASE;

  if (fishList.length === 0) {
    return (
      <Card title="鱼种图鉴" size="small">
        <div style={{ color: "#999", textAlign: "center", padding: 20 }}>
          暂无相关鱼种信息
        </div>
      </Card>
    );
  }

  return (
    <Card title="鱼种图鉴" size="small">
      <Collapse
        ghost
        items={fishList.map((fish) => ({
          key: fish.name,
          label: (
            <span>
              {fish.name}{" "}
              <Tag color={difficultyColors[fish.difficulty]} style={{ marginLeft: 4 }}>
                {difficultyLabels[fish.difficulty]}
              </Tag>
            </span>
          ),
          children: <FishItem fish={fish} />,
        }))}
      />
    </Card>
  );
}
