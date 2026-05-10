import { Spot, WeatherData, FISH_DATABASE } from "@/types";

// Recommendation weights
const WEIGHTS = {
  distance: 0.25,
  rating: 0.25,
  weather: 0.3,
  activity: 0.2,
};

// Distance scoring with exponential decay
function distanceScore(distKm: number): number {
  if (distKm <= 2) return 1.0;
  if (distKm <= 5) return 0.9;
  if (distKm <= 10) return 0.75;
  if (distKm <= 20) return 0.6;
  if (distKm <= 50) return 0.4;
  if (distKm <= 100) return 0.25;
  if (distKm <= 200) return 0.15;
  return 0.1;
}

// Weather scoring based on fishing conditions
function weatherScore(weather: WeatherData): number {
  let score = 0.5;

  // Pressure analysis (most important factor)
  // Ideal: 1010-1025 hPa, stable or rising
  if (weather.pressure >= 1013 && weather.pressure <= 1023) {
    score += 0.25; // Perfect pressure
  } else if (weather.pressure >= 1010 && weather.pressure <= 1025) {
    score += 0.2; // Good pressure
  } else if (weather.pressure >= 1005 && weather.pressure <= 1030) {
    score += 0.1; // Acceptable
  } else if (weather.pressure < 1000) {
    score -= 0.15; // Low pressure, fish inactive
  }

  // Wind speed analysis
  // Light wind (1-3) is ideal, helps oxygenate water
  if (weather.windSpeed >= 1 && weather.windSpeed <= 3) {
    score += 0.15; // Ideal wind
  } else if (weather.windSpeed < 1) {
    score += 0.05; // Too calm, may need to cast far
  } else if (weather.windSpeed <= 5) {
    score += 0.05; // Moderate wind
  } else if (weather.windSpeed > 7) {
    score -= 0.2; // Too windy, hard to fish
  }

  // Weather condition
  const goodConditions = ["多云", "阴", "少云", "晴间多云"];
  const badConditions = ["暴雨", "雷阵雨", "大雨", "台风"];

  if (goodConditions.includes(weather.text)) {
    score += 0.15; // Overcast is best
  } else if (weather.text === "晴") {
    score += 0.05; // Sunny is okay
  } else if (badConditions.some((c) => weather.text.includes(c))) {
    score -= 0.3; // Dangerous conditions
  }

  // Temperature comfort zone (varies by season)
  const month = new Date().getMonth() + 1;
  let idealTempMin = 15;
  let idealTempMax = 28;

  if ([12, 1, 2].includes(month)) {
    // Winter
    idealTempMin = 5;
    idealTempMax = 15;
  } else if ([6, 7, 8].includes(month)) {
    // Summer
    idealTempMin = 22;
    idealTempMax = 35;
  }

  if (weather.temp >= idealTempMin && weather.temp <= idealTempMax) {
    score += 0.1;
  } else if (weather.temp < idealTempMin - 5 || weather.temp > idealTempMax + 5) {
    score -= 0.1;
  }

  // Humidity (moderate is best)
  if (weather.humidity >= 40 && weather.humidity <= 70) {
    score += 0.05;
  }

  return Math.max(0, Math.min(1, score));
}

// Seasonal activity scoring
function activityScore(spot: Spot): number {
  const month = new Date().getMonth() + 1;
  let score = 0.5;

  // Season bonus
  if ([3, 4, 5].includes(month)) {
    score += 0.25; // Spring: fish become active after winter
  } else if ([9, 10, 11].includes(month)) {
    score += 0.25; // Autumn: fish feed heavily before winter
  } else if ([6, 7, 8].includes(month)) {
    score += 0.1; // Summer: good for some species
  } else {
    score += 0.05; // Winter: slower fishing
  }

  // Fish species diversity bonus
  const speciesCount = spot.fishSpecies?.length || 0;
  if (speciesCount >= 5) score += 0.15;
  else if (speciesCount >= 3) score += 0.1;
  else if (speciesCount >= 1) score += 0.05;

  // Spot type bonus based on season
  if (spot.type === "sea" && [6, 7, 8, 9].includes(month)) {
    score += 0.1; // Summer is best for sea fishing
  } else if (spot.type === "reservoir" && [3, 4, 5, 9, 10].includes(month)) {
    score += 0.1; // Spring/autumn for reservoirs
  } else if (spot.type === "river" && [4, 5, 6, 9, 10].includes(month)) {
    score += 0.05; // Rivers are good in spring/autumn
  }

  return Math.min(1, score);
}

// Calculate overall recommendation score
export function calculateRecommendationScore(
  spot: Spot,
  distanceKm: number,
  weather: WeatherData | null
): number {
  const dScore = distanceScore(distanceKm);
  const rScore = spot.rating / 5;
  const wScore = weather ? weatherScore(weather) : 0.5;
  const aScore = activityScore(spot);

  const totalScore =
    WEIGHTS.distance * dScore +
    WEIGHTS.rating * rScore +
    WEIGHTS.weather * wScore +
    WEIGHTS.activity * aScore;

  return Math.round(totalScore * 100) / 100;
}

// Get fishing advice based on weather and spot
export function getFishingAdvice(
  weather: WeatherData,
  spot: Spot
): { level: "excellent" | "good" | "fair" | "poor"; text: string; tips: string[] } {
  const score = weatherScore(weather);
  const tips: string[] = [];

  // Pressure advice
  if (weather.pressure >= 1013 && weather.pressure <= 1023) {
    tips.push("气压稳定适宜，鱼口活跃");
  } else if (weather.pressure < 1005) {
    tips.push("气压偏低，鱼可能上浮，建议钓浮或离底");
  } else if (weather.pressure > 1030) {
    tips.push("气压偏高，鱼可能在深水，建议钓底");
  }

  // Wind advice
  if (weather.windSpeed >= 1 && weather.windSpeed <= 3) {
    tips.push("微风天气，水中溶氧充足，鱼口好");
  } else if (weather.windSpeed > 5) {
    tips.push("风力较大，建议选择避风钓位或使用重坠");
  }

  // Temperature advice
  if (weather.temp < 10) {
    tips.push("水温较低，鱼活性差，建议用红虫蚯蚓等活饵");
  } else if (weather.temp > 30) {
    tips.push("高温天气，建议早晚出钓，中午鱼会躲到深水");
  }

  // Weather condition advice
  if (["多云", "阴"].includes(weather.text)) {
    tips.push("阴天是钓鱼的好天气，鱼警惕性低");
  } else if (weather.text === "晴") {
    tips.push("晴天建议钓深水或阴凉处");
  }

  // Spot type specific advice
  if (spot.type === "sea") {
    tips.push("海钓注意潮汐，涨潮和落潮时鱼口最好");
  } else if (spot.type === "reservoir") {
    tips.push("水库钓鱼建议选择桦尖、湾子等有利地形");
  } else if (spot.type === "river") {
    tips.push("河流钓鱼建议选择缓流区、回水湾");
  }

  // Determine fishing level
  let level: "excellent" | "good" | "fair" | "poor";
  if (score >= 0.75) level = "excellent";
  else if (score >= 0.6) level = "good";
  else if (score >= 0.4) level = "fair";
  else level = "poor";

  // Generate summary text
  let text: string;
  switch (level) {
    case "excellent":
      text = "非常适合钓鱼 - 条件极佳，出钓必有收获！";
      break;
    case "good":
      text = "适合钓鱼 - 条件良好，值得一试";
      break;
    case "fair":
      text = "条件一般 - 可以出钓，需要耐心";
      break;
    default:
      text = "不太适合钓鱼 - 建议改日出钓";
      break;
  }

  return { level, text, tips };
}

// Get recommended fish species for current season
export function getSeasonalFish(spot: Spot): string[] {
  const month = new Date().getMonth() + 1;
  const spotFish = spot.fishSpecies || [];

  // Filter fish that are active in current season
  return spotFish.filter((fishName) => {
    const fishInfo = FISH_DATABASE.find((f) => f.name === fishName);
    if (!fishInfo) return true; // Include unknown fish

    const { bestSeason } = fishInfo;
    if ([3, 4, 5].includes(month) && bestSeason.includes("春")) return true;
    if ([6, 7, 8].includes(month) && bestSeason.includes("夏")) return true;
    if ([9, 10, 11].includes(month) && bestSeason.includes("秋")) return true;
    if ([12, 1, 2].includes(month) && bestSeason.includes("冬")) return true;
    if (bestSeason.includes("四季")) return true;
    return false;
  });
}

// Haversine distance calculation
export function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
