import { Spot, Post, WeatherData } from "@/types";
import spotsData from "@/data/spots.json";
import postsData from "@/data/posts.json";
import { calculateRecommendationScore, getDistanceKm } from "./recommend";

const STORAGE_KEYS = {
  POSTS: "fishing_app_posts",
  LIKES: "fishing_app_likes",
  FAVORITES: "fishing_app_favorites",
};

function getStoredPosts(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getStoredLikes(): Record<number, number> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LIKES);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function getStoredFavorites(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getSpots(): Spot[] {
  return spotsData as Spot[];
}

export function getSpotById(id: number): Spot | undefined {
  return spotsData.find((s) => s.id === id) as Spot | undefined;
}

export function getPosts(spotId?: number): Post[] {
  const basePosts = postsData as Post[];
  const userPosts = getStoredPosts();
  const likes = getStoredLikes();

  const allPosts = [...basePosts, ...userPosts].map((p) => ({
    ...p,
    likes: p.likes + (likes[p.id] || 0),
  }));

  if (spotId) {
    return allPosts.filter((p) => p.spotId === spotId);
  }
  return allPosts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addPost(post: Omit<Post, "id" | "likes" | "createdAt">): Post {
  const userPosts = getStoredPosts();
  const newPost: Post = {
    ...post,
    id: Date.now(),
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  userPosts.push(newPost);
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(userPosts));
  return newPost;
}

export function likePost(postId: number): void {
  const likes = getStoredLikes();
  likes[postId] = (likes[postId] || 0) + 1;
  localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));
}

export function getRecommendations(
  lat: number,
  lng: number,
  weather?: WeatherData | null
): (Spot & { distance: number; score: number })[] {
  const spots = spotsData as Spot[];

  const scored = spots.map((spot) => {
    const distance = getDistanceKm(lat, lng, spot.latitude, spot.longitude);
    const score = calculateRecommendationScore(spot, distance, weather ?? null);
    return {
      ...spot,
      distance: Math.round(distance * 10) / 10,
      score: Math.round(score * 100) / 100,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}

export function getFavorites(): number[] {
  return getStoredFavorites();
}

export function toggleFavorite(spotId: number): boolean {
  const favorites = getStoredFavorites();
  const index = favorites.indexOf(spotId);
  if (index >= 0) {
    favorites.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return false;
  } else {
    favorites.push(spotId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
  }
}

export function isFavorite(spotId: number): boolean {
  return getStoredFavorites().includes(spotId);
}

export async function fetchWeather(
  lat: number,
  lng: number
): Promise<{
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDir: string;
  text: string;
  icon: number;
  forecast?: { date: string; tempMax: number; tempMin: number; text: string }[];
} | null> {
  const mockWeather = {
    temp: 22,
    feelsLike: 21,
    humidity: 65,
    pressure: 1013,
    windSpeed: 2.5,
    windDir: "东南风",
    text: "多云",
    icon: 101,
    forecast: [
      { date: "今天", tempMax: 25, tempMin: 18, text: "多云" },
      { date: "明天", tempMax: 27, tempMin: 19, text: "晴" },
      { date: "后天", tempMax: 24, tempMin: 17, text: "小雨" },
    ],
  };

  try {
    const res = await fetch(
      `https://devapi.qweather.com/v7/weather/now?location=${lng},${lat}&key=demo`
    );
    if (!res.ok) return mockWeather;
    const data = await res.json();
    if (!data.now) return mockWeather;
    return {
      temp: parseFloat(data.now.temp),
      feelsLike: parseFloat(data.now.feelsLike),
      humidity: parseFloat(data.now.humidity),
      pressure: parseFloat(data.now.pressure),
      windSpeed: parseFloat(data.now.windSpeed),
      windDir: data.now.windDir,
      text: data.now.text,
      icon: parseInt(data.now.icon),
    };
  } catch {
    return mockWeather;
  }
}
