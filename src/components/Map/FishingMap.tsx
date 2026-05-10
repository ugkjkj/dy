"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Spot, SPOT_TYPE_LABELS } from "@/types";
import { Spin, message } from "antd";

interface FishingMapProps {
  spots: Spot[];
  center?: [number, number];
  onSpotClick?: (spot: Spot) => void;
  height?: string;
}

export default function FishingMap({
  spots,
  center = [116.397, 39.908],
  onSpotClick,
  height = "500px",
}: FishingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        () => {
          // Use default Beijing location
          setUserLocation(center);
        }
      );
    } else {
      setUserLocation(center);
    }
  }, [center]);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || !userLocation) return;

      try {
        // Dynamic import to avoid SSR issues
        const AMapLoader = (await import("@amap/amap-jsapi-loader")).default;

        // Load Amap SDK with a development key
        // Note: In production, replace with your own Amap API key
        const AMap = await AMapLoader.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || "",
          version: "2.0",
          plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.Geolocation"],
        });

        // Create map instance
        const map = new AMap.Map(mapRef.current, {
          zoom: 10,
          center: userLocation,
          mapStyle: "amap://styles/normal",
          resizeEnable: true,
        });

        // Add scale control
        map.addControl(new AMap.Scale());

        // Add toolbar control
        map.addControl(new AMap.ToolBar({ position: "RT" }));

        // Add user location marker
        const userMarker = new AMap.Marker({
          position: userLocation,
          title: "我的位置",
          content: `
            <div style="position: relative; width: 24px; height: 24px;">
              <div style="position: absolute; width: 24px; height: 24px; background: #1890ff; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
              <div style="position: absolute; width: 60px; height: 60px; background: rgba(24,144,255,0.2); border-radius: 50%; top: -18px; left: -18px; animation: pulse 2s infinite;"></div>
            </div>
            <style>
              @keyframes pulse {
                0% { transform: scale(0.8); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.5; }
                100% { transform: scale(0.8); opacity: 1; }
              }
            </style>
          `,
          offset: new AMap.Pixel(-12, -12),
          zIndex: 100,
        });
        map.add(userMarker);

        // Add fishing spot markers
        const newMarkers: any[] = [];
        spots.forEach((spot) => {
          const markerContent = `
            <div style="position: relative; cursor: pointer;">
              <div style="
                background: ${getMarkerColor(spot.type)};
                color: white;
                padding: 6px 10px;
                border-radius: 16px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                text-align: center;
                line-height: 1.4;
              ">
                <div style="font-size: 14px;">${getMarkerIcon(spot.type)}</div>
                <div style="max-width: 80px; overflow: hidden; text-overflow: ellipsis;">${spot.name}</div>
                <div style="font-size: 10px; opacity: 0.9;">${SPOT_TYPE_LABELS[spot.type as keyof typeof SPOT_TYPE_LABELS]}</div>
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 8px solid ${getMarkerColor(spot.type)};
                margin: 0 auto;
              "></div>
            </div>
          `;

          const marker = new AMap.Marker({
            position: [spot.longitude, spot.latitude],
            title: spot.name,
            content: markerContent,
            offset: new AMap.Pixel(-40, -60),
            extData: spot,
          });

          // Add click event
          marker.on("click", () => {
            onSpotClick?.(spot);
          });

          // Add hover effect
          marker.on("mouseover", () => {
            marker.setzIndex(50);
          });

          marker.on("mouseout", () => {
            marker.setzIndex(10);
          });

          map.add(marker);
          newMarkers.push(marker);
        });

        markersRef.current = newMarkers;
        mapInstanceRef.current = map;

        // Fit map to show all markers
        if (spots.length > 0) {
          map.setFitView(newMarkers, false, [100, 100, 100, 100]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load Amap:", error);
        message.error("地图加载失败，使用简化视图");
        setLoading(false);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [spots, userLocation]);

  const getMarkerColor = (type: string) => {
    const colors: Record<string, string> = {
      river: "#1890ff",
      lake: "#13c2c2",
      sea: "#2f54eb",
      reservoir: "#52c41a",
    };
    return colors[type] || "#ff4d4f";
  };

  const getMarkerIcon = (type: string) => {
    const icons: Record<string, string> = {
      river: "🏞️",
      lake: "🌊",
      sea: "⚓",
      reservoir: "💧",
    };
    return icons[type] || "📍";
  };

  // Fallback view if Amap fails to load
  if (!loading && !mapInstanceRef.current) {
    return (
      <div style={{ height, position: "relative" }}>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #e8f5e9 0%, #b2dfdb 50%, #80cbc4 100%)",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Spot markers */}
          {spots.map((spot, idx) => {
            const x = 10 + ((idx * 17 + 30) % 75);
            const y = 10 + ((idx * 23 + 20) % 70);
            return (
              <div
                key={spot.id}
                onClick={() => onSpotClick?.(spot)}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -100%)",
                  cursor: "pointer",
                  zIndex: 10,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translate(-50%, -100%) scale(1.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translate(-50%, -100%)")
                }
              >
                {/* Pin */}
                <div
                  style={{
                    background: getMarkerColor(spot.type),
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "16px" }}>{getMarkerIcon(spot.type)}</div>
                  <div style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {spot.name}
                  </div>
                  <div style={{ fontSize: "10px", opacity: 0.9 }}>
                    {SPOT_TYPE_LABELS[spot.type as keyof typeof SPOT_TYPE_LABELS]}
                  </div>
                </div>
                {/* Pin tail */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: `8px solid ${getMarkerColor(spot.type)}`,
                    margin: "0 auto",
                  }}
                />
              </div>
            );
          })}

          {/* User location */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                background: "#1890ff",
                borderRadius: "50%",
                border: "3px solid white",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* Legend */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              background: "rgba(255,255,255,0.9)",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>图例</div>
            <div>🔵 我的位置</div>
            <div>📍 钓点位置 (共 {spots.length} 个)</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.8)",
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <Spin>加载地图中...</Spin>
        </div>
      )}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
