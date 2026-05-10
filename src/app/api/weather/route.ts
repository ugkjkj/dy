import { NextRequest, NextResponse } from "next/server";

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
    { date: "今天", tempMax: 25, tempMin: 18, text: "多云", icon: 101 },
    { date: "明天", tempMax: 27, tempMin: 19, text: "晴", icon: 100 },
    { date: "后天", tempMax: 24, tempMin: 17, text: "小雨", icon: 305 },
  ],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
  }

  const apiKey = process.env.QWEATHER_KEY;
  if (!apiKey || apiKey === "demo") {
    return NextResponse.json(mockWeather);
  }

  try {
    const locationRes = await fetch(
      `https://geoapi.qweather.com/v2/city/lookup?location=${lng},${lat}&key=${apiKey}`
    );
    if (!locationRes.ok) {
      return NextResponse.json(mockWeather);
    }
    const locationData = await locationRes.json();

    if (!locationData.location?.[0]) {
      return NextResponse.json(mockWeather);
    }

    const locationId = locationData.location[0].id;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=${apiKey}`),
      fetch(`https://devapi.qweather.com/v7/weather/3d?location=${locationId}&key=${apiKey}`),
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      return NextResponse.json(mockWeather);
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    const now = weatherData.now;
    if (!now) {
      return NextResponse.json(mockWeather);
    }

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
  } catch {
    return NextResponse.json(mockWeather);
  }
}
