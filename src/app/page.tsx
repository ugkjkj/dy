"use client";

import { useEffect, useState, useCallback } from "react";
import { Select, Input, Row, Col, Spin, Empty, Typography, Tag, Card, Statistic } from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  AimOutlined,
  TrophyOutlined,
  CloudOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import FishingMap from "@/components/Map/FishingMap";
import SpotCard from "@/components/SpotCard/SpotCard";
import { Spot, SPOT_TYPE_LABELS } from "@/types";

const { Title, Text } = Typography;

export default function HomePage() {
  const router = useRouter();
  const [spots, setSpots] = useState<(Spot & { distance?: number; score?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number]>([116.4, 39.9]);
  const [locationName, setLocationName] = useState<string>("定位中...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setLocationName("已定位");
          fetchSpots(latitude, longitude);
        },
        () => {
          setLocationName("北京");
          fetchSpots(39.9, 116.4);
        }
      );
    } else {
      setLocationName("北京");
      fetchSpots(39.9, 116.4);
    }
  }, []);

  const fetchSpots = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/recommend?lat=${lat}&lng=${lng}&limit=20`);
      const data = await res.json();
      setSpots(data);
    } catch (err) {
      console.error("Failed to fetch spots:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpotClick = useCallback((spot: Spot) => {
    router.push(`/spot/${spot.id}`);
  }, [router]);

  const filteredSpots = spots.filter((spot) => {
    const matchType = !filter || spot.type === filter;
    const matchSearch =
      !search ||
      spot.name.includes(search) ||
      spot.fishSpecies?.some((f: string) => f.includes(search));
    return matchType && matchSearch;
  });

  // Stats
  const totalSpots = spots.length;
  const avgRating = spots.length > 0
    ? (spots.reduce((sum, s) => sum + s.rating, 0) / spots.length).toFixed(1)
    : "0";
  const nearestSpot = spots.length > 0
    ? spots.reduce((min, s) => (s.distance !== undefined && s.distance < (min.distance ?? Infinity) ? s : min), spots[0])
    : null;

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100%" }}>
      {/* Hero Section */}
      <div className="hero-section gradient-primary" style={{ padding: "48px 24px", textAlign: "center", color: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Title level={1} style={{ color: "white", marginBottom: 12, fontSize: 36 }}>
            发现你的下一个爆护钓点
          </Title>
          <Text style={{ fontSize: 18, opacity: 0.9, display: "block", marginBottom: 24 }}>
            基于天气、距离、评分的智能推荐，帮你找到最佳钓鱼位置
          </Text>
          <Tag
            icon={<EnvironmentOutlined />}
            color="white"
            style={{ color: "#096dd9", fontWeight: 500, padding: "4px 16px", fontSize: 14 }}
          >
            当前位置：{locationName}
          </Tag>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        {/* Quick Stats */}
        <Row gutter={16} style={{ marginBottom: 24 }} className="animate-fade-in-up">
          <Col xs={12} sm={8}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                title="钓点总数"
                value={totalSpots}
                prefix={<AimOutlined style={{ color: "#1890ff" }} />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                title="平均评分"
                value={avgRating}
                precision={1}
                prefix={<TrophyOutlined style={{ color: "#faad14" }} />}
                suffix="/ 5"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                title="最近钓点"
                value={nearestSpot ? `${nearestSpot.distance} km` : "计算中..."}
                prefix={<CompassOutlined style={{ color: "#52c41a" }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }} className="animate-fade-in">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="搜索钓点名称或鱼种..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="水域类型"
              value={filter || undefined}
              onChange={(v) => setFilter(v || "")}
              allowClear
              size="large"
              style={{ width: "100%", borderRadius: 8 }}
              options={Object.entries(SPOT_TYPE_LABELS).map(([key, label]) => ({
                value: key,
                label,
              }))}
            />
          </Col>
        </Row>

        {/* Map */}
        <div className="map-container animate-fade-in-up" style={{ marginBottom: 24 }}>
          <FishingMap
            spots={filteredSpots}
            center={userLocation}
            onSpotClick={handleSpotClick}
            height="450px"
          />
        </div>

        {/* Recommended Spots */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            <TrophyOutlined style={{ color: "#faad14", marginRight: 8 }} />
            推荐钓点
          </Title>
          <Tag color="blue">共 {filteredSpots.length} 个钓点</Tag>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip="加载钓点数据..." />
          </div>
        ) : filteredSpots.length === 0 ? (
          <Card>
            <Empty description="暂无符合条件的钓点" />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredSpots.map((spot, idx) => (
              <Col xs={24} sm={12} lg={8} key={spot.id}>
                <div className={`animate-fade-in-up stagger-${Math.min(idx % 5 + 1, 5)}`}>
                  <SpotCard
                    spot={spot}
                    onClick={() => router.push(`/spot/${spot.id}`)}
                  />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
