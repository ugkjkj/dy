"use client";

import { Card, Tag, Space, List, Typography } from "antd";
import {
  CloudOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDir: string;
  text: string;
  icon: number;
  forecast?: { date: string; tempMax: number; tempMin: number; text: string }[];
}

interface WeatherPanelProps {
  weather: WeatherData;
}

interface FishingAdvice {
  level: "excellent" | "good" | "fair" | "poor";
  text: string;
  color: string;
  icon: React.ReactNode;
  tips: string[];
}

function getFishingAdvice(weather: WeatherData): FishingAdvice {
  const { pressure, windSpeed, temp, text } = weather;
  const tips: string[] = [];
  let score = 50;

  // Pressure analysis
  if (pressure >= 1013 && pressure <= 1023) {
    score += 25;
    tips.push("气压稳定适宜（" + pressure + " hPa），鱼口活跃");
  } else if (pressure >= 1010 && pressure <= 1025) {
    score += 15;
    tips.push("气压条件良好，鱼口较好");
  } else if (pressure < 1005) {
    score -= 20;
    tips.push("气压偏低，鱼可能上浮，建议钓浮或离底");
  } else if (pressure > 1030) {
    score -= 10;
    tips.push("气压偏高，鱼可能在深水区，建议钓底");
  }

  // Wind analysis
  if (windSpeed >= 1 && windSpeed <= 3) {
    score += 15;
    tips.push("微风天气（" + windSpeed + " m/s），水中溶氧充足");
  } else if (windSpeed < 1) {
    tips.push("无风天气，可能需要钓远一些");
  } else if (windSpeed <= 5) {
    score += 5;
    tips.push("风力适中，注意调整浮漂");
  } else {
    score -= 20;
    tips.push("风力较大（" + windSpeed + " m/s），建议选择避风钓位");
  }

  // Temperature analysis
  if (temp >= 15 && temp <= 28) {
    score += 10;
    tips.push("水温适宜（" + temp + "°C），鱼类活跃");
  } else if (temp < 10) {
    score -= 15;
    tips.push("水温较低，鱼活性差，建议用红虫蚯蚓等活饵");
  } else if (temp > 32) {
    score -= 10;
    tips.push("高温天气，建议早晚出钓，中午鱼会躲到深水");
  }

  // Weather condition
  const goodConditions = ["多云", "阴", "少云", "晴间多云"];
  const badConditions = ["暴雨", "雷阵雨", "大雨", "台风"];

  if (goodConditions.includes(text)) {
    score += 15;
    tips.push("阴天是钓鱼的好天气，鱼警惕性低");
  } else if (text === "晴") {
    score += 5;
    tips.push("晴天建议钓深水或阴凉处");
  } else if (badConditions.some((c) => text.includes(c))) {
    score -= 30;
    tips.push("恶劣天气，不建议出钓，注意安全");
  }

  // Humidity
  if (weather.humidity >= 40 && weather.humidity <= 70) {
    score += 5;
  }

  // Determine level
  let level: "excellent" | "good" | "fair" | "poor";
  let color: string;
  let icon: React.ReactNode;
  let textResult: string;

  if (score >= 80) {
    level = "excellent";
    color = "green";
    icon = <CheckCircleOutlined />;
    textResult = "非常适合钓鱼 - 条件极佳，出钓必有收获！";
  } else if (score >= 60) {
    level = "good";
    color = "blue";
    icon = <CheckCircleOutlined />;
    textResult = "适合钓鱼 - 条件良好，值得一试";
  } else if (score >= 40) {
    level = "fair";
    color = "orange";
    icon = <InfoCircleOutlined />;
    textResult = "条件一般 - 可以出钓，需要耐心";
  } else {
    level = "poor";
    color = "red";
    icon = <WarningOutlined />;
    textResult = "不太适合钓鱼 - 建议改日出钓";
  }

  return { level, text: textResult, color, icon, tips };
}

function getPressureLevel(pressure: number): { text: string; color: string } {
  if (pressure >= 1013 && pressure <= 1023) return { text: "适宜", color: "#52c41a" };
  if (pressure >= 1010 && pressure <= 1025) return { text: "良好", color: "#1890ff" };
  if (pressure < 1005) return { text: "偏低", color: "#faad14" };
  if (pressure > 1030) return { text: "偏高", color: "#faad14" };
  return { text: "正常", color: "#666" };
}

function getWindLevel(windSpeed: number): { text: string; color: string } {
  if (windSpeed < 1) return { text: "无风", color: "#666" };
  if (windSpeed <= 3) return { text: "微风", color: "#52c41a" };
  if (windSpeed <= 5) return { text: "和风", color: "#1890ff" };
  if (windSpeed <= 7) return { text: "清风", color: "#faad14" };
  return { text: "大风", color: "#ff4d4f" };
}

export default function WeatherPanel({ weather }: WeatherPanelProps) {
  const advice = getFishingAdvice(weather);
  const pressureLevel = getPressureLevel(weather.pressure);
  const windLevel = getWindLevel(weather.windSpeed);

  return (
    <Card
      title={
        <Space>
          <CloudOutlined />
          实时天气 & 钓鱼建议
        </Space>
      }
      size="small"
    >
      {/* Current Weather */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 32, fontWeight: "bold", color: "#1890ff" }}>
            {weather.temp}°C
          </div>
          <div style={{ color: "#999", fontSize: 13 }}>
            体感 {weather.feelsLike}°C
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 500 }}>{weather.text}</div>
          <div style={{ color: "#999", fontSize: 13 }}>
            {weather.windDir} {weather.windSpeed} m/s
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginBottom: 16,
          padding: "12px 0",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <DashboardOutlined style={{ fontSize: 20, color: "#1890ff" }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{weather.pressure}</div>
          <div style={{ fontSize: 11, color: "#999" }}>hPa 气压</div>
          <Tag color={pressureLevel.color} style={{ marginTop: 4, fontSize: 11 }}>
            {pressureLevel.text}
          </Tag>
        </div>
        <div style={{ textAlign: "center" }}>
          <ThunderboltOutlined style={{ fontSize: 20, color: "#52c41a" }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{weather.humidity}%</div>
          <div style={{ fontSize: 11, color: "#999" }}>湿度</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <CloudOutlined style={{ fontSize: 20, color: "#722ed1" }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{weather.windSpeed}</div>
          <div style={{ fontSize: 11, color: "#999" }}>m/s 风速</div>
          <Tag color={windLevel.color} style={{ marginTop: 4, fontSize: 11 }}>
            {windLevel.text}
          </Tag>
        </div>
      </div>

      {/* Fishing Advice */}
      <div
        style={{
          background: advice.level === "excellent" ? "#f6ffed" :
                     advice.level === "good" ? "#e6f7ff" :
                     advice.level === "fair" ? "#fff7e6" : "#fff2f0",
          padding: 12,
          borderRadius: 6,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ color: advice.color, fontSize: 18 }}>{advice.icon}</span>
          <Text strong style={{ color: advice.color }}>{advice.text}</Text>
        </div>

        <List
          size="small"
          dataSource={advice.tips}
          renderItem={(tip) => (
            <List.Item style={{ padding: "4px 0", border: "none" }}>
              <Text style={{ fontSize: 12 }}>• {tip}</Text>
            </List.Item>
          )}
        />
      </div>

      {/* Forecast */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>未来天气预报</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {weather.forecast.map((day, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  padding: "8px",
                  background: "#fafafa",
                  borderRadius: 4,
                  flex: 1,
                  margin: "0 2px",
                }}
              >
                <div style={{ color: "#999", marginBottom: 4 }}>{day.date}</div>
                <div style={{ fontWeight: 500 }}>{day.text}</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ color: "#ff4d4f" }}>{day.tempMax}°</span>
                  <span style={{ color: "#999" }}> / </span>
                  <span style={{ color: "#1890ff" }}>{day.tempMin}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
