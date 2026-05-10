import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
  }

  const apiKey = process.env.QWEATHER_KEY || "demo";

  // Use QWeather free API
  const locationRes = await fetch(
    `https://geoapi.qweather.com/v2/city/lookup?location=${lng},${lat}&key=${apiKey}`
  );
  const locationData = await locationRes.json();

  if (!locationData.location?.[0]) {
    // Return mock data if API not configured
    return NextResponse.json({
      temp: 22,
      feelsLike: 21,
      humidity: 65,
      pressure: 1013,
      windSpeed: 2.5,
      windDir: "东南风",
      text: "多云",
      icon: 101,
      forecast: [
        { date: "今天", tempMax: 25, tempMin: 18, text: "多云", icon: 101 },
        { date: "明天", tempMax: 27, tempMin: 19, text: "晴", icon: 100 },
        { date: "后天", tempMax: 24, tempMin: 17, text: "小雨", icon: 305 },
      ],
    });
  }

  const locationId = locationData.location[0].id;

  // Get current weather
  const weatherRes = await fetch(
    `https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=${apiKey}`
  );
  const weatherData = await weatherRes.json();

  // Get 3-day forecast
  const forecastRes = await fetch(
    `https://devapi.qweather.com/v7/weather/3d?location=${locationId}&key=${apiKey}`
  );
  const forecastData = await forecastRes.json();

  const now = weatherData.now;

  return NextResponse.json({
    temp: parseFloat(now.temp),
    feelsLike: parseFloat(now.feelsLike),
    humidity: parseFloat(now.humidity),
    pressure: parseFloat(now.pressure),
    windSpeed: parseFloat(now.windSpeed),
    windDir: now.windDir,
    text: now.text,
    icon: parseInt(now.icon),
    forecast: (forecastData.daily || []).map((d: Record<string, string>) => ({
      date: d.fxDate,
      tempMax: parseFloat(d.tempMax),
      tempMin: parseFloat(d.tempMin),
      text: d.textDay,
      icon: parseInt(d.iconDay),
    })),
  });
}
