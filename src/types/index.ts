export interface Spot {
  id: number;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  type: "river" | "lake" | "sea" | "reservoir";
  fishSpecies: string[];
  rating: number;
  imageUrl: string | null;
  createdAt: string;
  posts?: Post[];
}

export interface Post {
  id: number;
  title: string;
  content: string;
  images: string[];
  spotId: number;
  spot?: Spot;
  author: string;
  fishType: string | null;
  weight: number | null;
  likes: number;
  createdAt: string;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDir: string;
  text: string;
  icon: number;
}

export interface FishInfo {
  name: string;
  species: string;
  description: string;
  habitat: string;
  bait: string[];
  methods: string[];
  bestTemp: string;
  bestTime: string;
  bestSeason: string;
  difficulty: "easy" | "medium" | "hard";
  tips: string;
}

export type SpotType = "river" | "lake" | "sea" | "reservoir";

export const SPOT_TYPE_LABELS: Record<SpotType, string> = {
  river: "河流",
  lake: "湖泊",
  sea: "海域",
  reservoir: "水库",
};

export const FISH_DATABASE: FishInfo[] = [
  // ===== 淡水鱼 =====
  {
    name: "鲫鱼",
    species: "Carassius auratus",
    description: "最常见的淡水鱼，适应性强，四季可钓，是新手入门的首选目标鱼。",
    habitat: "底层",
    bait: ["蚯蚓", "红虫", "商品饵", "玉米", "麦粒"],
    methods: ["台钓", "传统钓", "浮钓"],
    bestTemp: "15-25°C",
    bestTime: "早晨/傍晚",
    bestSeason: "春秋最佳，四季可钓",
    difficulty: "easy",
    tips: "冬季鲫鱼开口小，建议用细线小钩，饵料以红虫蚯蚓为主。",
  },
  {
    name: "鲤鱼",
    species: "Cyprinus carpio",
    description: "淡水大型鱼种，力量大，遛鱼手感好，是很多钓友的终极目标。",
    habitat: "底层",
    bait: ["玉米", "螺蛳", "商品饵", "薯类", "发酵饵"],
    methods: ["台钓", "海竿", "爆炸钩", "翻板钩"],
    bestTemp: "18-28°C",
    bestTime: "全天",
    bestSeason: "春秋最佳，夏季早晚",
    difficulty: "medium",
    tips: "鲤鱼警惕性高，打窝要提前，钓位选择深浅交界处。",
  },
  {
    name: "草鱼",
    species: "Ctenopharyngodon idella",
    description: "草食性鱼类，体型大，中钩后冲力强，遛鱼刺激。",
    habitat: "中下层",
    bait: ["嫩草", "玉米", "南瓜藤", "桑葚", "商品饵"],
    methods: ["浮钓", "底钓", "海竿"],
    bestTemp: "22-30°C",
    bestTime: "午后",
    bestSeason: "夏秋最佳",
    difficulty: "medium",
    tips: "草鱼喜食植物性饵料，夏季用嫩草浮钓效果极佳。",
  },
  {
    name: "鲢鳙",
    species: "Hypophthalmichthys",
    description: "滤食性鱼类，喜欢雾化饵料，夏季高温时最活跃。",
    habitat: "中上层",
    bait: ["酸臭饵", "发酵饵", "商品鲢鳙饵", "蒜味饵"],
    methods: ["浮钓", "水怪钓组"],
    bestTemp: "25-32°C",
    bestTime: "白天",
    bestSeason: "夏季最佳",
    difficulty: "medium",
    tips: "鲢鳙对雾化要求高，饵料要松散，频率要快。",
  },
  {
    name: "鲈鱼",
    species: "Lateolabrax japonicus",
    description: "海淡水均可生存的肉食性鱼类，路亚热门目标，肉质鲜美。",
    habitat: "中下层",
    bait: ["活虾", "小鱼", "路亚假饵", "软虫", "VIB"],
    methods: ["路亚", "活饵钓", "岸钓"],
    bestTemp: "18-25°C",
    bestTime: "清晨/黄昏",
    bestSeason: "春秋最佳",
    difficulty: "hard",
    tips: "鲈鱼喜欢在障碍物附近伏击猎物，钓位选择石堆、桥墩、水草边。",
  },
  {
    name: "黑鱼",
    species: "Channa argus",
    description: "凶猛的肉食性鱼类，路亚热门目标鱼，中钩后挣扎激烈。",
    habitat: "底层",
    bait: ["活蛙", "雷蛙", "软虫", "小鱼", "德州钓组"],
    methods: ["路亚", "活饵钓"],
    bestTemp: "20-30°C",
    bestTime: "夏季白天",
    bestSeason: "夏秋最佳",
    difficulty: "hard",
    tips: "黑鱼有护幼习性，繁殖期在窝边打雷蛙效果极佳。",
  },
  {
    name: "翘嘴",
    species: "Culter alburnus",
    description: "中上层掠食性鱼类，路亚经典目标，速度快，攻击性强。",
    habitat: "中上层",
    bait: ["亮片", "米诺", "铅笔", "VIB", "活虾"],
    methods: ["路亚", "浮钓", "活饵钓"],
    bestTemp: "18-28°C",
    bestTime: "早晚",
    bestSeason: "春秋最佳",
    difficulty: "hard",
    tips: "翘嘴喜欢追逐快速移动的假饵，收线速度要快。",
  },
  {
    name: "罗非鱼",
    species: "Oreochromis niloticus",
    description: "热带鱼种，南方水域常见，适应力极强，繁殖快。",
    habitat: "底层",
    bait: ["蚯蚓", "商品饵", "鸡肝", "虾", "面包虫"],
    methods: ["台钓", "底钓"],
    bestTemp: "25-35°C",
    bestTime: "白天",
    bestSeason: "夏季最佳",
    difficulty: "easy",
    tips: "罗非鱼口小但吃饵凶猛，调漂要灵，抓第一口。",
  },
  {
    name: "鳊鱼",
    species: "Parabramis pekinensis",
    description: "中下层杂食性鱼类，体型扁平，成群活动，手感好。",
    habitat: "中下层",
    bait: ["商品饵", "蚯蚓", "玉米", "麦粒"],
    methods: ["台钓", "浮钓"],
    bestTemp: "18-28°C",
    bestTime: "全天",
    bestSeason: "春秋最佳",
    difficulty: "easy",
    tips: "鳊鱼成群活动，中一条后不要急着收竿，继续钓会有连竿。",
  },
  {
    name: "黄颡鱼",
    species: "Pelteobagrus fulvidraco",
    description: "底层肉食性鱼类，俗称黄辣丁，肉质鲜美，无鳞。",
    habitat: "底层",
    bait: ["蚯蚓", "鸡肝", "虾", "红虫"],
    methods: ["传统钓", "底钓"],
    bestTemp: "20-28°C",
    bestTime: "夜晚",
    bestSeason: "夏秋最佳",
    difficulty: "easy",
    tips: "黄颡鱼夜间活跃，夜钓效果好。注意背鳍有刺，取钩要小心。",
  },

  // ===== 海水鱼 =====
  {
    name: "石斑鱼",
    species: "Epinephelinae",
    description: "名贵海鱼，肉质细嫩，喜欢躲在礁石缝隙中伏击猎物。",
    habitat: "底层",
    bait: ["活虾", "活鱼", "鱿鱼", "蟹肉"],
    methods: ["船钓", "矶钓", "沉底钓"],
    bestTemp: "22-28°C",
    bestTime: "白天",
    bestSeason: "夏秋最佳",
    difficulty: "hard",
    tips: "石斑鱼中钩后会往礁石里钻，要及时收线防止切线。",
  },
  {
    name: "黄鳍鲷",
    species: "Acanthopagrus latus",
    description: "常见海鱼，肉质鲜美，喜欢在河口和内湾活动。",
    habitat: "底层",
    bait: ["虾", "沙蚕", "蚯蚓", "商品饵"],
    methods: ["矶钓", "岸钓", "浮游矶钓"],
    bestTemp: "20-28°C",
    bestTime: "涨潮/落潮",
    bestSeason: "春秋最佳",
    difficulty: "medium",
    tips: "黄鳍鲷对潮汐敏感，涨潮和落潮时最活跃。",
  },
  {
    name: "海鲈",
    species: "Lateolabrax japonicus",
    description: "海水中大型鲈鱼，力量比淡水鲈鱼更大，路亚目标鱼。",
    habitat: "中下层",
    bait: ["活虾", "活鱼", "路亚假饵", "软虫"],
    methods: ["路亚", "活饵钓", "岸钓"],
    bestTemp: "18-24°C",
    bestTime: "清晨/黄昏",
    bestSeason: "春秋最佳",
    difficulty: "hard",
    tips: "海鲈喜欢在防波堤、码头附近活动，路亚选择米诺和VIB。",
  },
  {
    name: "鲻鱼",
    species: "Mugil cephalus",
    description: "河口常见鱼类，成群活动，手感好，适合新手海钓。",
    habitat: "中上层",
    bait: ["面饵", "蚯蚓", "沙蚕", "商品饵"],
    methods: ["浮钓", "底钓"],
    bestTemp: "18-25°C",
    bestTime: "涨潮",
    bestSeason: "春秋最佳",
    difficulty: "easy",
    tips: "鲻鱼成群活动，中一条后会有连竿，饵料要雾化好。",
  },
  {
    name: "黑鲷",
    species: "Acanthopagrus schlegelii",
    description: "名贵海鱼，肉质鲜美，喜欢在礁石区活动。",
    habitat: "底层",
    bait: ["虾", "沙蚕", "蟹肉", "贝类"],
    methods: ["矶钓", "沉底钓"],
    bestTemp: "18-25°C",
    bestTime: "夜间",
    bestSeason: "秋冬最佳",
    difficulty: "medium",
    tips: "黑鲷夜间活跃，矶钓时选择浪脚和礁石缝隙。",
  },

  // ===== 其他水产 =====
  {
    name: "大闸蟹",
    species: "Eriocheir sinensis",
    description: "中华绒螯蟹，秋季美食，阳澄湖最出名。",
    habitat: "底层",
    bait: ["鸡肝", "蚯蚓", "玉米", "小鱼"],
    methods: ["蟹笼", "手钓", "底钓"],
    bestTemp: "15-22°C",
    bestTime: "夜间",
    bestSeason: "秋季最佳（9-11月）",
    difficulty: "easy",
    tips: "大闸蟹秋季最肥，用鸡肝作饵效果好，蟹笼放置在水草边。",
  },
];
