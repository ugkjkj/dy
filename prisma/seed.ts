import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

const spots = [
  // ===== 北京 =====
  {
    name: "密云水库",
    description: "北京最大的水库，水质优良，鱼种丰富，是京郊钓鱼的首选之地。鲤鱼、草鱼个体大，鲫鱼密度高。",
    latitude: 40.5127,
    longitude: 116.8447,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲤鱼", "草鱼", "鲫鱼", "鲢鳙", "鲈鱼"]),
    rating: 4.7,
  },
  {
    name: "怀柔水库",
    description: "风景秀丽的水库，适合休闲垂钓，鲫鱼密度高，新手友好。",
    latitude: 40.3167,
    longitude: 116.6167,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "草鱼"]),
    rating: 4.3,
  },
  {
    name: "官厅水库",
    description: "永定河上游大型水库，水面广阔，大鱼出没频繁，适合海竿守大鱼。",
    latitude: 40.2333,
    longitude: 115.6,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲤鱼", "草鱼", "鲢鳙", "翘嘴"]),
    rating: 4.5,
  },
  {
    name: "潮白河",
    description: "北京东部重要河流，河段宽阔，适合多种钓法，夜钓黑鱼效果好。",
    latitude: 39.9167,
    longitude: 116.85,
    type: "river",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "黑鱼", "翘嘴"]),
    rating: 4.0,
  },
  {
    name: "十三陵水库",
    description: "著名风景区内的水库，环境优美，适合家庭出游垂钓。",
    latitude: 40.25,
    longitude: 116.2667,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "鲢鳙"]),
    rating: 4.2,
  },
  {
    name: "昆明湖",
    description: "颐和园内的湖泊，风景绝佳，可钓鲫鱼和鲤鱼，休闲首选。",
    latitude: 39.9983,
    longitude: 116.275,
    type: "lake",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼"]),
    rating: 3.8,
  },
  {
    name: "北运河",
    description: "北京东部的运河，历史悠久，鲫鱼和鲤鱼较多，交通便利。",
    latitude: 39.9,
    longitude: 116.7,
    type: "river",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "罗非鱼"]),
    rating: 3.5,
  },
  {
    name: "平谷金海湖",
    description: "京东大峡谷旁的湖泊，水质清澈，适合路亚和台钓，鲈鱼出没。",
    latitude: 40.1833,
    longitude: 117.1667,
    type: "lake",
    fishSpecies: JSON.stringify(["鲈鱼", "翘嘴", "鲤鱼", "鲫鱼"]),
    rating: 4.4,
  },
  {
    name: "沙河水库",
    description: "昌平区大型水库，水深鱼大，适合守钓大鲤鱼和草鱼。",
    latitude: 40.15,
    longitude: 116.35,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲤鱼", "草鱼", "鲫鱼"]),
    rating: 4.1,
  },
  {
    name: "永定河",
    description: "北京西部重要河流，河面宽阔，鲫鱼鲤鱼密度高，适合传统钓。",
    latitude: 39.92,
    longitude: 116.22,
    type: "river",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "鲢鱼"]),
    rating: 3.9,
  },

  // ===== 上海 =====
  {
    name: "淀山湖",
    description: "上海最大的淡水湖，水质优良，大闸蟹和鲈鱼出名，适合多种钓法。",
    latitude: 31.1,
    longitude: 120.95,
    type: "lake",
    fishSpecies: JSON.stringify(["鲈鱼", "鲫鱼", "鲤鱼", "翘嘴", "大闸蟹"]),
    rating: 4.5,
  },
  {
    name: "崇明岛东滩",
    description: "长江入海口，海淡水交汇，鲈鱼和鲻鱼丰富，适合海钓。",
    latitude: 31.52,
    longitude: 121.95,
    type: "sea",
    fishSpecies: JSON.stringify(["鲈鱼", "鲻鱼", "海鲈"]),
    rating: 4.2,
  },

  // ===== 广东 =====
  {
    name: "万绿湖",
    description: "华南最大的人工湖，水质清澈，大头鱼和鲤鱼出名，风景秀丽。",
    latitude: 23.75,
    longitude: 114.5,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲤鱼", "鲢鳙", "草鱼", "鲫鱼"]),
    rating: 4.6,
  },
  {
    name: "松山湖",
    description: "东莞松山湖，环境优美，鲫鱼密度高，适合休闲垂钓。",
    latitude: 22.93,
    longitude: 113.88,
    type: "lake",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "罗非鱼"]),
    rating: 4.0,
  },
  {
    name: "珠海东澳岛",
    description: "珠海海岛钓场，海水清澈，石斑鱼和黄鳍鲷出没，适合船钓。",
    latitude: 22.1,
    longitude: 113.72,
    type: "sea",
    fishSpecies: JSON.stringify(["石斑鱼", "黄鳍鲷", "海鲈"]),
    rating: 4.4,
  },

  // ===== 浙江 =====
  {
    name: "千岛湖",
    description: "中国著名钓鱼胜地，水质一级，有机鱼出名，大鱼频出。",
    latitude: 29.6,
    longitude: 119.0,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲤鱼", "草鱼", "鲢鳙", "鲫鱼", "翘嘴"]),
    rating: 4.8,
  },
  {
    name: "西湖",
    description: "杭州西湖，风景绝佳，鲫鱼鲤鱼较多，适合休闲台钓。",
    latitude: 30.25,
    longitude: 120.15,
    type: "lake",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "鲢鱼"]),
    rating: 3.7,
  },
  {
    name: "舟山群岛",
    description: "中国最大的渔场，海钓天堂，鱼种丰富，适合各种海钓方式。",
    latitude: 30.0,
    longitude: 122.1,
    type: "sea",
    fishSpecies: JSON.stringify(["黄鱼", "带鱼", "鲈鱼", "石斑鱼"]),
    rating: 4.7,
  },

  // ===== 江苏 =====
  {
    name: "太湖",
    description: "中国第三大淡水湖，白虾和银鱼出名，鲫鱼鲤鱼密度高。",
    latitude: 31.2,
    longitude: 120.2,
    type: "lake",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "鲢鳙", "翘嘴"]),
    rating: 4.3,
  },
  {
    name: "阳澄湖",
    description: "大闸蟹的故乡，水质优良，鲈鱼和鲫鱼出没，秋季最佳。",
    latitude: 31.4,
    longitude: 120.8,
    type: "lake",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "鲈鱼"]),
    rating: 4.1,
  },

  // ===== 湖北 =====
  {
    name: "丹江口水库",
    description: "南水北调水源地，水质极佳，有机鱼出名，大鲤鱼频出。",
    latitude: 32.5,
    longitude: 111.5,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲤鱼", "草鱼", "鲢鳙", "翘嘴", "鲫鱼"]),
    rating: 4.6,
  },
  {
    name: "东湖",
    description: "武汉东湖，城市湖泊，鲫鱼鲤鱼较多，交通便利。",
    latitude: 30.55,
    longitude: 114.37,
    type: "lake",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "鲢鱼"]),
    rating: 3.6,
  },

  // ===== 四川 =====
  {
    name: "升钟湖",
    description: "中国钓鱼城，国家级钓鱼基地，大鲤鱼和草鱼出名。",
    latitude: 31.35,
    longitude: 105.95,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲤鱼", "草鱼", "鲢鳙", "鲫鱼"]),
    rating: 4.7,
  },
  {
    name: "黑龙滩",
    description: "仁寿县大型水库，水质清澈，适合台钓和海竿。",
    latitude: 30.0,
    longitude: 104.15,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲤鱼", "草鱼", "鲫鱼"]),
    rating: 4.2,
  },

  // ===== 山东 =====
  {
    name: "微山湖",
    description: "中国北方最大淡水湖，鲫鱼鲤鱼丰富，传统钓圣地。",
    latitude: 34.6,
    longitude: 117.1,
    type: "lake",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "鲢鳙", "黑鱼"]),
    rating: 4.4,
  },
  {
    name: "青岛金沙滩",
    description: "青岛著名海滩钓场，鲈鱼和黑鲷出没，适合岸钓。",
    latitude: 35.92,
    longitude: 120.2,
    type: "sea",
    fishSpecies: JSON.stringify(["鲈鱼", "黑鲷", "比目鱼"]),
    rating: 4.0,
  },

  // ===== 湖南 =====
  {
    name: "东江湖",
    description: "资兴市著名水库，雾漫小东江，有机鱼出名，大鱼频出。",
    latitude: 25.95,
    longitude: 113.4,
    type: "reservoir",
    fishSpecies: JSON.stringify(["鲤鱼", "草鱼", "鲢鳙", "翘嘴"]),
    rating: 4.5,
  },

  // ===== 云南 =====
  {
    name: "滇池",
    description: "昆明滇池，高原湖泊，鲫鱼鲤鱼较多，风景秀丽。",
    latitude: 24.95,
    longitude: 102.68,
    type: "lake",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "鲢鱼"]),
    rating: 3.8,
  },
  {
    name: "洱海",
    description: "大理洱海，高原明珠，弓鱼出名，适合休闲垂钓。",
    latitude: 25.75,
    longitude: 100.2,
    type: "lake",
    fishSpecies: JSON.stringify(["鲫鱼", "鲤鱼", "弓鱼"]),
    rating: 4.3,
  },
];

const posts = [
  {
    title: "密云水库大爆护！",
    content: "今天在密云水库守了一天，早上6点到的，用玉米打窝，9点开始连竿，一共钓了20多条鲫鱼，最大的有半斤！下午换了钓位还上了一条3斤的鲤鱼，今天真是爆护的一天！",
    images: JSON.stringify([]),
    spotId: 1,
    author: "钓鱼老张",
    fishType: "鲫鱼",
    weight: 0.5,
    likes: 12,
  },
  {
    title: "怀柔水库钓鲫鱼心得",
    content: "怀柔水库的鲫鱼密度很高，推荐用蚯蚓作饵，调4钓2，浮漂动作很标准。今天钓了30多条，虽然都不大但手感很好，适合新手练习。",
    images: JSON.stringify([]),
    spotId: 2,
    author: "新手小李",
    fishType: "鲫鱼",
    weight: 0.3,
    likes: 8,
  },
  {
    title: "官厅水库路亚翘嘴",
    content: "周末去官厅水库路亚，用亮片在水面上抽，翘嘴很活跃，中了5条，最大的快2斤了！建议傍晚时分去，鱼口最好。",
    images: JSON.stringify([]),
    spotId: 3,
    author: "路亚达人",
    fishType: "翘嘴",
    weight: 1.8,
    likes: 25,
  },
  {
    title: "金海湖钓鲈鱼",
    content: "金海湖的鲈鱼真不小，用软虫慢慢拖底，中了一条将近3斤的鲈鱼，遛了10分钟才上岸。这个地方的鲈鱼确实长得好，推荐大家去试试。",
    images: JSON.stringify([]),
    spotId: 8,
    author: "鲈鱼猎手",
    fishType: "鲈鱼",
    weight: 2.8,
    likes: 18,
  },
  {
    title: "潮白河夜钓黑鱼",
    content: "夏天晚上在潮白河用雷蛙打黑鱼，效果拔群！连续中了3条黑鱼，最大的4斤多，手感超级爽。提醒大家夜钓注意安全，带好头灯。",
    images: JSON.stringify([]),
    spotId: 4,
    author: "夜钓侠",
    fishType: "黑鱼",
    weight: 4.2,
    likes: 31,
  },
  {
    title: "千岛湖三日游钓",
    content: "千岛湖的水质真的好，清澈见底。这次去了三天，第一天用玉米守鲤鱼，上了4条，最大的6斤。第二天路亚翘嘴，中了8条。第三天台钓鲫鱼，爆护了！强烈推荐！",
    images: JSON.stringify([]),
    spotId: 16,
    author: "浙江钓友",
    fishType: "鲤鱼",
    weight: 6.0,
    likes: 45,
  },
  {
    title: "淀山湖大闸蟹季",
    content: "秋天去淀山湖，除了钓鱼还能钓大闸蟹。用鸡肝钓螃蟹，用蚯蚓钓鲫鱼，一天下来收获满满。鲈鱼也很活跃，用软虫路亚中了3条。",
    images: JSON.stringify([]),
    spotId: 11,
    author: "上海钓客",
    fishType: "鲈鱼",
    weight: 2.5,
    likes: 22,
  },
  {
    title: "万绿湖钓大头鱼",
    content: "万绿湖的大头鱼真大！用水怪钓组，酸臭饵料，浮钓2米深。守了2小时，突然一个大黑漂，遛了15分钟才上岸，称了一下12斤！",
    images: JSON.stringify([]),
    spotId: 13,
    author: "广东钓王",
    fishType: "鲢鳙",
    weight: 12.0,
    likes: 56,
  },
  {
    title: "舟山船钓石斑",
    content: "跟船出海去舟山钓石斑，用活虾作饵，沉底钓。石斑鱼力气真大，中钩后拼命往礁石里钻。一天钓了5条，最大的4斤多，晚上直接清蒸了！",
    images: JSON.stringify([]),
    spotId: 18,
    author: "海钓高手",
    fishType: "石斑鱼",
    weight: 4.5,
    likes: 38,
  },
  {
    title: "升钟湖钓大鲤鱼",
    content: "升钟湖不愧是中国钓鱼城，鲤鱼真大！用老坛玉米打窝，守了3天，每天都有口。最大的一条8斤多，遛了20分钟才上岸，太刺激了！",
    images: JSON.stringify([]),
    spotId: 23,
    author: "四川钓侠",
    fishType: "鲤鱼",
    weight: 8.2,
    likes: 42,
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.post.deleteMany();
  await prisma.spot.deleteMany();

  // Create spots and store their IDs
  const createdSpots: { id: number; name: string }[] = [];
  for (const spot of spots) {
    const created = await prisma.spot.create({ data: spot });
    createdSpots.push({ id: created.id, name: created.name });
  }
  console.log(`Created ${createdSpots.length} spots`);

  // Map spot names to IDs for posts
  const spotNameToId: Record<string, number> = {};
  for (const spot of createdSpots) {
    spotNameToId[spot.name] = spot.id;
  }

  // Create posts with correct spot IDs
  for (const post of posts) {
    // Find spot ID by name from the original spot data
    const originalSpot = spots[post.spotId - 1];
    const spotId = originalSpot ? spotNameToId[originalSpot.name] : createdSpots[0].id;

    await prisma.post.create({
      data: {
        ...post,
        spotId: spotId || createdSpots[0].id,
      },
    });
  }
  console.log(`Created ${posts.length} posts`);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
