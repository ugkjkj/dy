"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Card,
  message,
  Typography,
  Upload,
  Space,
  Tag,
  Divider,
} from "antd";
import {
  PlusOutlined,
  PictureOutlined,
  SendOutlined,
  EnvironmentOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Spot, SPOT_TYPE_LABELS } from "@/types";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSpots();
    const spotId = searchParams.get("spotId");
    if (spotId) {
      form.setFieldsValue({ spotId: parseInt(spotId) });
    }
  }, [searchParams, form]);

  const fetchSpots = async () => {
    try {
      const res = await fetch("/api/spots");
      const data = await res.json();
      setSpots(data);
    } catch (err) {
      console.error("Failed to fetch spots:", err);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImages((prev) => [...prev, data.url]);
        message.success("图片上传成功");
      } else {
        const error = await res.json();
        message.error(error.error || "上传失败");
      }
    } catch {
      message.error("上传失败，请重试");
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          author: values.author || "匿名钓友",
          images,
        }),
      });

      if (res.ok) {
        message.success("发布成功！");
        router.push("/community");
      } else {
        const error = await res.json();
        message.error(error.error || "发布失败");
      }
    } catch {
      message.error("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100%", padding: "24px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ marginBottom: 24, textAlign: "center" }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            <EditOutlined style={{ marginRight: 8 }} />
            发布钓鱼日志
          </Title>
          <Text type="secondary">分享你的钓鱼故事，与其他钓友交流心得</Text>
        </div>

        <Card className="animate-fade-in-up">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ author: "匿名钓友" }}
            size="large"
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: "请输入标题" }]}
            >
              <Input
                placeholder="例如：今天在XX水库大爆护！"
                prefix={<EditOutlined style={{ color: "#bfbfbf" }} />}
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <EnvironmentOutlined />
                  钓点
                </Space>
              }
              name="spotId"
              rules={[{ required: true, message: "请选择钓点" }]}
            >
              <Select
                placeholder="选择你钓鱼的地点"
                showSearch
                optionFilterProp="label"
                options={spots.map((s) => ({
                  value: s.id,
                  label: `${s.name} - ${SPOT_TYPE_LABELS[s.type as keyof typeof SPOT_TYPE_LABELS]}`,
                }))}
              />
            </Form.Item>

            <Form.Item label="钓鱼人" name="author">
              <Input placeholder="你的昵称（默认：匿名钓友）" />
            </Form.Item>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item label="鱼种" name="fishType">
                <Select
                  placeholder="选择或输入鱼种"
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  options={[
                    { value: "鲫鱼", label: "鲫鱼" },
                    { value: "鲤鱼", label: "鲤鱼" },
                    { value: "草鱼", label: "草鱼" },
                    { value: "鲢鳙", label: "鲢鳙" },
                    { value: "鲈鱼", label: "鲈鱼" },
                    { value: "黑鱼", label: "黑鱼" },
                    { value: "翘嘴", label: "翘嘴" },
                    { value: "罗非鱼", label: "罗非鱼" },
                    { value: "石斑鱼", label: "石斑鱼" },
                    { value: "其他", label: "其他" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="重量（斤）" name="weight">
                <InputNumber
                  placeholder="0.0"
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>

            <Form.Item
              label="内容"
              name="content"
              rules={[{ required: true, message: "请输入钓鱼日志内容" }]}
            >
              <TextArea
                rows={6}
                placeholder="分享你的钓鱼经历、收获、心得...&#10;&#10;例如：今天天气不错，用了XX饵料，钓了XX鱼，最大的有XX斤..."
              />
            </Form.Item>

            {/* Image Upload */}
            <Form.Item label="图片">
              <div style={{ marginBottom: 12 }}>
                <Upload
                  listType="picture-card"
                  beforeUpload={handleUpload}
                  showUploadList={false}
                  accept="image/*"
                  disabled={uploading}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      {uploading ? "上传中..." : "上传图片"}
                    </div>
                  </div>
                </Upload>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid #d9d9d9",
                      }}
                    >
                      <img
                        src={img}
                        alt={`图片 ${idx + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <Button
                        type="primary"
                        danger
                        size="small"
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          minWidth: 24,
                          height: 24,
                          padding: 0,
                        }}
                        onClick={() => handleRemoveImage(idx)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: "block" }}>
                支持 JPG, PNG, GIF, WebP 格式，单张最大 5MB
              </Text>
            </Form.Item>

            <Divider />

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                icon={<SendOutlined />}
              >
                发布日志
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
