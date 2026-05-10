import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "钓鱼助手 - 寻找最佳钓鱼位置",
  description: "发现附近最佳钓鱼位置，获取实时天气和钓鱼建议",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
