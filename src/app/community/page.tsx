"use client";

import { useEffect, useState } from "react";
import { Select, Row, Col, Spin, Empty, Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard/PostCard";
import { Post } from "@/types";

const { Title } = Typography;

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fishFilter, setFishFilter] = useState<string>("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts?limit=50");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const filteredPosts = fishFilter
    ? posts.filter((p) => p.fishType?.includes(fishFilter))
    : posts;

  const fishTypes = [...new Set(posts.map((p) => p.fishType).filter(Boolean))];

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100%" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #722ed1 0%, #13c2c2 100%)",
          padding: "32px 24px",
          textAlign: "center",
          color: "white",
        }}
      >
        <Title level={2} style={{ color: "white", marginBottom: 8 }}>
          钓鱼社区
        </Title>
        <p style={{ fontSize: 16, opacity: 0.9 }}>
          分享你的钓鱼故事，看看其他钓友的精彩收获
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Select
            placeholder="按鱼种筛选"
            allowClear
            value={fishFilter || undefined}
            onChange={(v) => setFishFilter(v || "")}
            style={{ width: 200 }}
            options={fishTypes.map((f) => ({ value: f, label: f }))}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/post")}
          >
            发布日志
          </Button>
        </div>

        {/* Posts */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Empty description="暂无钓鱼日志">
            <Button type="primary" onClick={() => router.push("/post")}>
              发布第一条日志
            </Button>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredPosts.map((post) => (
              <Col xs={24} sm={12} key={post.id}>
                <PostCard post={post} onLike={() => handleLike(post.id)} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
