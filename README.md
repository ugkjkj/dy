# 🎣 钓鱼助手

发现你的下一个爆护钓点 - 基于智能推荐的最佳钓鱼位置

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Ant Design](https://img.shields.io/badge/Ant%20Design-6-blue?logo=antdesign)
![Prisma](https://img.shields.io/badge/Prisma-6-blue?logo=prisma)

## ✨ 功能特性

### 🗺️ 智能钓点推荐
- 基于距离、评分、天气、季节的综合推荐算法
- 高德地图集成，真实显示钓点位置
- 支持按水域类型筛选（河流/湖泊/水库/海域）

### 🌤️ 天气钓鱼建议
- 实时天气数据（温度、气压、风速、湿度）
- 根据天气条件给出钓鱼建议
- 气压分析、风力评估

### 🐟 鱼种图鉴
- 16种常见鱼种详细信息
- 推荐饵料、钓法、最佳水温
- 季节性活跃度分析

### 👥 社区分享
- 发布钓鱼日志
- 图片上传功能
- 点赞互动

### 📊 数据覆盖
- 29个全国知名钓点
- 覆盖北京、上海、广东、浙江、江苏、湖北、四川、山东、湖南、云南等省市

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 初始化数据库

```bash
npx prisma migrate dev
npm run seed
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
钓鱼/
├── .github/workflows/    # GitHub Actions 配置
├── prisma/
│   ├── schema.prisma     # 数据库模型
│   └── seed.ts           # 种子数据
├── src/
│   ├── app/
│   │   ├── api/          # API 接口
│   │   ├── spot/[id]/    # 钓点详情页
│   │   ├── post/         # 发布日志页
│   │   └── community/    # 社区动态页
│   ├── components/       # React 组件
│   ├── lib/             # 工具函数
│   └── types/           # TypeScript 类型
└── public/              # 静态资源
```

## 🔧 技术栈

- **前端框架**: Next.js 16 + React 19
- **UI 组件库**: Ant Design 6
- **地图服务**: 高德地图 JS API
- **数据库**: SQLite + Prisma ORM
- **开发语言**: TypeScript

## 🌐 部署

### Vercel 部署

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### GitHub Pages 部署

项目已配置 GitHub Actions，推送到 main 分支后自动部署。

### 手动部署

```bash
npm run build
npm run start
```

## 📝 环境变量

创建 `.env.local` 文件：

```env
# 高德地图 API Key
NEXT_PUBLIC_AMAP_KEY=your_amap_key

# 和风天气 API Key
QWEATHER_KEY=your_qweather_key

# 数据库
DATABASE_URL="file:./prisma/dev.db"
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**钓鱼助手** - 让每一次出钓都有收获 🎣
