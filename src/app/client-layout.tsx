"use client";

import { Layout, Menu, Badge, Tooltip } from "antd";
import {
  HomeOutlined,
  EditOutlined,
  TeamOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const { Header, Content, Footer } = Layout;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: "首页" },
    { key: "/post", icon: <EditOutlined />, label: "发布日志" },
    { key: "/community", icon: <TeamOutlined />, label: "社区动态" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: scrolled ? "rgba(0, 21, 41, 0.95)" : "#001529",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginRight: 48,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "transform 0.2s ease",
          }}
          onClick={() => router.push("/")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={{ fontSize: 28 }}>🎣</span>
          <span className="text-gradient" style={{
            background: "linear-gradient(135deg, #fff 0%, #b7eb8f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            钓鱼助手
          </span>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            borderBottom: "none",
          }}
        />
        <Tooltip title="收藏钓点">
          <Badge count={0} size="small">
            <HeartOutlined
              style={{
                color: "white",
                fontSize: 20,
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ff4d4f")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            />
          </Badge>
        </Tooltip>
      </Header>

      <Content style={{ padding: 0 }}>{children}</Content>

      <Footer
        style={{
          textAlign: "center",
          padding: "24px 50px",
          background: "#001529",
          color: "rgba(255,255,255,0.65)",
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 20, marginRight: 8 }}>🎣</span>
          <span style={{ fontWeight: 500, color: "white" }}>钓鱼助手</span>
        </div>
        <div style={{ fontSize: 13, marginBottom: 8 }}>
          发现你的下一个爆护钓点 · 基于智能推荐的最佳钓鱼位置
        </div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          ©{new Date().getFullYear()} 钓鱼助手 - 让每一次出钓都有收获
        </div>
      </Footer>
    </Layout>
  );
}
