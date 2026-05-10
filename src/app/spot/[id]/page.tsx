"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Tag,
  Rate,
  Descriptions,
  Button,
  Spin,
  Space,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  AimOutlined,
} from "@ant-design/icons";
import WeatherPanel from "@/components/WeatherPanel/WeatherPanel";
import FishGuide from "@/components/FishGuide/FishGuide";
import PostCard from "@/components/PostCard/PostCard";
import { Spot, Post, WeatherData, SPOT_TYPE_LABELS, SpotType } from "@/types";

const typeColors: Record<SpotType, string> = {
  river: "blue",
  lake: "cyan",
  sea: "geekblue",
  reservoir: "green",
};

export default function SpotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchSpotDetail(params.id as string);
    }
  }, [params.id]);

  const fetchSpotDetail = async (id: string) => {
    try {
      const [spotRes, postsRes] = await Promise.all([
        fetch(`/api/spots/${id}`),
        fetch(`/api/posts?spotId=${id}`),
      ]);

      if (!spotRes.ok) {
        message.error("钓点不存在");
        router.push("/");
        return;
      }

      const spotData = await spotRes.json();
      setSpot(spotData);
      setPosts(await postsRes.json());

      try {
        const weatherRes = await fetch(
          `/api/weather?lat=${spotData.latitude}&lng=${spotData.longitude}`
        );
        setWeather(await weatherRes.json());
      } catch {
        // Weather fetch failed, continue without it
      }
    } catch (err) {
      console.error("Failed to fetch spot:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!spot) return null;

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100%" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #096dd9 0%, #13c2c2 100%)",
          padding: "24px",
          color: "white",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            style={{ color: "white", marginBottom: 8 }}
          >
            返回
          </Button>
          <h1 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>
            {spot.name}
          </h1>
          <Space>
            <Tag color={typeColors[spot.type as SpotType]}>
              {SPOT_TYPE_LABELS[spot.type as SpotType]}
            </Tag>
            <Rate disabled value={spot.rating} allowHalf style={{ fontSize: 14 }} />
            <span>{spot.rating} 分</span>
          </Space>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 24,
          }}
        >
          {/* Left Column */}
          <div>
            {/* Spot Info */}
            <Card title="钓点信息" style={{ marginBottom: 24 }}>
              <Descriptions column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="位置">
                  <EnvironmentOutlined /> {spot.latitude.toFixed(4)},{" "}
                  {spot.longitude.toFixed(4)}
                </Descriptions.Item>
                <Descriptions.Item label="水域类型">
                  <Tag color={typeColors[spot.type as SpotType]}>
                    {SPOT_TYPE_LABELS[spot.type as SpotType]}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="可钓鱼种" span={2}>
                  <AimOutlined />{" "}
                  {spot.fishSpecies?.join("、") || "暂无数据"}
                </Descriptions.Item>
                {spot.description && (
                  <Descriptions.Item label="简介" span={2}>
                    {spot.description}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {/* Fish Guide */}
            <div style={{ marginBottom: 24 }}>
              <FishGuide species={spot.fishSpecies} />
            </div>

            {/* Community Posts */}
            <Card
              title={`钓鱼日志 (${posts.length})`}
              extra={
                <Button
                  type="primary"
                  size="small"
                  onClick={() => router.push(`/post?spotId=${spot.id}`)}
                >
                  发布日志
                </Button>
              }
            >
              {posts.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
                  暂无钓鱼日志，快来发布第一条吧！
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </Card>
          </div>

          {/* Right Column - Weather */}
          <div>
            {weather && <WeatherPanel weather={weather} />}
          </div>
        </div>
      </div>
    </div>
  );
}
