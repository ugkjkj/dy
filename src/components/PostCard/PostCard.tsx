"use client";

import { Card, Tag, Space, Button } from "antd";
import {
  LikeOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onLike?: () => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const images: string[] = Array.isArray(post.images) ? post.images : [];

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <Space>
          <UserOutlined />
          <span style={{ fontWeight: 500 }}>{post.author}</span>
          <span style={{ color: "#999", fontSize: 12 }}>
            <CalendarOutlined />{" "}
            {new Date(post.createdAt).toLocaleDateString("zh-CN")}
          </span>
        </Space>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{post.title}</h3>

      <p style={{ color: "#333", marginBottom: 12, lineHeight: 1.6 }}>{post.content}</p>

      {images.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            overflowX: "auto",
          }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`图片 ${idx + 1}`}
              style={{
                width: 120,
                height: 90,
                objectFit: "cover",
                borderRadius: 6,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Space>
          {post.fishType && <Tag color="blue">{post.fishType}</Tag>}
          {post.weight && <Tag color="green">{post.weight}斤</Tag>}
          {post.spot && (
            <Tag icon={<EnvironmentOutlined />}>{post.spot.name}</Tag>
          )}
        </Space>

        <Button
          type="text"
          icon={<LikeOutlined />}
          onClick={onLike}
          size="small"
        >
          {post.likes}
        </Button>
      </div>
    </Card>
  );
}
