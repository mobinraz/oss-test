"use client";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import Image from "next/image";

type Props = {
  geoJson: any;
  onSelect?: (feature: any) => void;
};

type BlinkPoint = { key: string; name: string; lat: number; lng: number };

function getCentroidFromFeature(feature: any): [number, number] | null {
  const geom = feature?.geometry;
  if (!geom) return null;

  const coords: number[][] = [];

  const pushRing = (ring: any[]) => {
    ring?.forEach((p) => {
      if (Array.isArray(p) && p.length >= 2) coords.push([p[0], p[1]]); // [lng, lat]
    });
  };

  if (geom.type === "Polygon") {
    geom.coordinates?.forEach((ring: any[]) => pushRing(ring));
  } else if (geom.type === "MultiPolygon") {
    geom.coordinates?.forEach((poly: any[]) =>
      poly?.forEach((ring: any[]) => pushRing(ring)),
    );
  } else {
    return null;
  }

  if (!coords.length) return null;

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const [x, y] of coords) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  const lng = (minX + maxX) / 2;
  const lat = (minY + maxY) / 2;

  return [lat, lng];
}

function pickRandom<T>(arr: T[], n: number) {
  const copy = [...arr];
  copy.sort(() => Math.random() - 0.5);
  return copy.slice(0, Math.min(n, copy.length));
}

export default function NotificationMap({ geoJson, onSelect }: Props) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  const mapStyles = {
    news: {
      fillColor: "#B2C7D4",
      weight: 1,
      color: "#fff",
      fillOpacity: 0.9,
    },

    cr: {
      fillColor: "#B2C7D4",
      weight: 1,
      color: "#fff",
      fillOpacity: 0.9,
    },
    alarm: {
      fillColor: "#B2C7D4",
      weight: 1,
      color: "#fff",
      fillOpacity: 0.9,
    },
    hover: {
      weight: 2,
      color: "#fff",
      fillOpacity: 1,
    },
  };

  const blinkNews = useMemo<BlinkPoint[]>(() => {
    if (!geoJson?.features?.length) return [];
    const valid = geoJson.features
      .map((f: any, idx: number) => {
        const c = getCentroidFromFeature(f);
        if (!c) return null;
        const name = f.properties?.name || f.properties?.NAME_1 || "Unknown";
        return { idx, name, lat: c[0], lng: c[1] };
      })
      .filter(Boolean) as any[];

    const picked = pickRandom(valid, 6);
    return picked.map((p) => ({
      key: `news-${p.idx}`,
      name: p.name,
      lat: p.lat,
      lng: p.lng,
    }));
  }, [geoJson]);

  const blinkCR = useMemo<BlinkPoint[]>(() => {
    if (!geoJson?.features?.length) return [];
    const valid = geoJson.features
      .map((f: any, idx: number) => {
        const c = getCentroidFromFeature(f);
        if (!c) return null;
        const name = f.properties?.name || f.properties?.NAME_1 || "Unknown";
        return { idx, name, lat: c[0], lng: c[1] };
      })
      .filter(Boolean) as any[];

    const picked = pickRandom(valid, 4);
    return picked.map((p) => ({
      key: `cr-${p.idx}`,
      name: p.name,
      lat: p.lat,
      lng: p.lng,
    }));
  }, [geoJson]);

  const blinkAlarms = useMemo<BlinkPoint[]>(() => {
    if (!geoJson?.features?.length) return [];
    const valid = geoJson.features
      .map((f: any, idx: number) => {
        const c = getCentroidFromFeature(f);
        if (!c) return null;
        const name = f.properties?.name || f.properties?.NAME_1 || "Unknown";
        return { idx, name, lat: c[0], lng: c[1] };
      })
      .filter(Boolean) as any[];

    const picked = pickRandom(valid, 8);
    return picked.map((p) => ({
      key: `alarm-${p.idx}`,
      name: p.name,
      lat: p.lat,
      lng: p.lng,
    }));
  }, [geoJson]);

  const handleFeatureSelection = (feature: any, layer: L.Layer) => {
    const name =
      feature.properties?.name || feature.properties?.NAME_1 || "Unknown";

    layer.bindTooltip(name, {
      permanent: false,
      sticky: true,
      direction: "top",
      opacity: 0.95,
      className: "province-label",
    });

    layer.on({
      click: () => {
        setSelectedProvince(name);
        onSelect?.(feature);
        (layer as any).closeTooltip();
      },
      mouseover: (e) => {
        const target = e.target as L.Path;
        target.setStyle(mapStyles.hover);
        (layer as any).openTooltip();
      },
      mouseout: (e) => {
        (e.target as L.Path).setStyle({
          weight: 1,
          color: "#444",
        });
      },
    });
  };

  return (
    <div className="flex flex-col" id="oss-data">
      <div className="relative flex py-5 items-center">
        <div className="grow border-t border-gray-300"></div>
        <span className="shrink mx-4 text-gray-500 dark:text-gray-200">
          OSS Maps Data
        </span>
        <div className="grow border-t border-gray-300"></div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center lg:mt-0 mb-4 w-full gap-4 overflow-hidden">
        {/* News */}
        <div className="w-full z-10 overflow-hidden rounded-3xl">
          <MapContainer
            center={isMobile ? [35.4279, 59.688] : [32.4279, 53.688]}
            zoom={isMobile ? 3 : 4}
            scrollWheelZoom={false}
            dragging={false}
            zoomControl={false}
            doubleClickZoom={false}
            className="h-80 w-full map-news"
          >
            <div className="flex h-full flex-col items-start">
              <h1 className="px-3 pt-2 font-bold z-999 text-[12px] text-black">
                News
              </h1>
              <div className="mt-auto flex items-start gap-2 pl-4 pb-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full border-2 border-[#6177FB] bg-[#CFDAF3]" />
                  <h5 className="text-xs text-black">Flood</h5>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full border-2 border-[#DF435F] bg-[#E2D3DC]" />
                  <h1 className="text-xs text-black">Fire</h1>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 border-2 border-[#B47971] rounded-full bg-[#E2D9DB]" />
                  <h1 className="font-medium text-black">Earthquake</h1>
                </div>
              </div>
            </div>
            <TileLayer url="/pattern.png" />
            <GeoJSON
              data={geoJson}
              style={() => mapStyles.news}
              onEachFeature={handleFeatureSelection}
            />

            {blinkNews.map((p) => (
              <CircleMarker
                key={p.key}
                center={[p.lat, p.lng]}
                radius={12}
                pathOptions={{ className: "blink-dot blink-dot--news" }}
              >
                <Tooltip direction="top" opacity={0.9}>
                  {p.name}
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
          <div className="bg-white relative my-2 w-full p-6 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-[#D9DEFF]/60 rounded-lg flex justify-center">
                    <Image
                      src="/location.svg"
                      width={24}
                      height={24}
                      alt="Location"
                    />
                  </div>
                  <h4 className="font-bold text-center">FLOOD</h4>
                </div>
                <h4 className="text-xs text-[#667C89]">5 Provinces</h4>
              </div>
              <div className="my-4 flex justify-between">
                <div className="flex gap-3 text-xs font-bold">
                  Alborz | Tehran | Shiraz
                </div>
                <div className="text-[#00C2A8] text-xs font-bold cursor-pointer">
                  More...
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-[#F9DDD8]/60 rounded-lg flex justify-center">
                    <Image
                      src="/orange_location.svg"
                      width={24}
                      height={24}
                      alt="Location"
                    />
                  </div>
                  <h4 className="font-bold text-center">EARTHQUACKE</h4>
                </div>
                <h4 className="text-xs text-[#667C89]">0 Provinces</h4>
              </div>
              <div className="bg-[#ECEFF1] my-4 w-full h-12 rounded-lg border border-[#D0D8DB] flex items-center justify-center">
                <h5 className="text-center text-[#667C89]">
                  No Earthquacke Reported!
                </h5>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-[#F8D3D9]/60 rounded-lg flex justify-center">
                    <Image
                      src="/red_location.svg"
                      width={24}
                      height={24}
                      alt="Location"
                    />
                  </div>
                  <h4 className="font-bold text-center">FIRE</h4>
                </div>
                <h4 className="text-xs text-[#667C89]">1 Provinces</h4>
              </div>
              <div className="flex gap-3 text-xs mb-18 pt-4 font-bold">
                Tehran
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-22 bg-[#ECEFF1] flex items-center justify-center text-sm text-[#667C89] rounded-b-2xl z-10">
                <div className="flex gap-8">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">2G</h5>
                    <h3 className="font-bold text-black">13,550</h3>
                  </div>
                  <div className="w-px h-8 bg-[#B2BDC4]" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">3G</h5>
                    <h3 className="font-bold text-black">15,550</h3>
                  </div>
                  <div className="w-px h-8 bg-[#B2BDC4]" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">4G</h5>
                    <h3 className="font-bold text-black">19,550</h3>
                  </div>
                  <div className="w-px h-8 bg-[#B2BDC4]" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">5G</h5>
                    <h3 className="font-bold text-black">3550</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full z-10 overflow-hidden rounded-3xl">
          <MapContainer
            center={isMobile ? [35.4279, 59.688] : [32.4279, 53.688]}
            zoom={isMobile ? 3 : 4}
            scrollWheelZoom={false}
            dragging={false}
            zoomControl={false}
            doubleClickZoom={false}
            className="h-80 w-full map-cr"
          >
            <div className="flex flex-col gap-3">
              <h1 className="px-3 pt-2 absolute top-0 left-0 font-bold z-999 text-[12px] text-black">
                CR Time
              </h1>
              {/* <div className="absolute top-7 right-4 z-999 flex items-center gap-1">
                <h1 className="text-green-700 font-semibold">No. of CR</h1>
                <span className="w-2 h-2 rounded-full bg-green-700" />
              </div> */}
            </div>

            <TileLayer url="/pattern.png" />
            <GeoJSON
              data={geoJson}
              style={() => mapStyles.cr}
              onEachFeature={handleFeatureSelection}
            />

            {blinkCR.map((p) => (
              <CircleMarker
                key={p.key}
                center={[p.lat, p.lng]}
                radius={11}
                pathOptions={{ className: "blink-dot blink-dot--cr" }}
              >
                <Tooltip direction="top" opacity={0.9}>
                  {p.name}
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
            <div className="bg-white relative my-2 w-full p-6 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-[#D9DEFF]/60 rounded-lg flex justify-center">
                    <Image
                      src="/location.svg"
                      width={24}
                      height={24}
                      alt="Location"
                    />
                  </div>
                  <h4 className="font-bold text-center">FLOOD</h4>
                </div>
                <h4 className="text-xs text-[#667C89]">5 Provinces</h4>
              </div>
              <div className="my-4 flex justify-between">
                <div className="flex gap-3 text-xs font-bold">
                  Alborz | Tehran | Shiraz
                </div>
                <div className="text-[#00C2A8] text-xs font-bold cursor-pointer">
                  More...
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-[#F9DDD8]/60 rounded-lg flex justify-center">
                    <Image
                      src="/orange_location.svg"
                      width={24}
                      height={24}
                      alt="Location"
                    />
                  </div>
                  <h4 className="font-bold text-center">EARTHQUACKE</h4>
                </div>
                <h4 className="text-xs text-[#667C89]">0 Provinces</h4>
              </div>
              <div className="bg-[#ECEFF1] my-4 w-full h-12 rounded-lg border border-[#D0D8DB] flex items-center justify-center">
                <h5 className="text-center text-[#667C89]">
                  No Earthquacke Reported!
                </h5>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-[#F8D3D9]/60 rounded-lg flex justify-center">
                    <Image
                      src="/red_location.svg"
                      width={24}
                      height={24}
                      alt="Location"
                    />
                  </div>
                  <h4 className="font-bold text-center">FIRE</h4>
                </div>
                <h4 className="text-xs text-[#667C89]">1 Provinces</h4>
              </div>
              <div className="flex gap-3 text-xs mb-18 pt-4 font-bold">
                Tehran
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-22 bg-[#ECEFF1] flex items-center justify-center text-sm text-[#667C89] rounded-b-2xl z-10">
                <div className="flex gap-8">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">2G</h5>
                    <h3 className="font-bold text-black">13,550</h3>
                  </div>
                  <div className="w-px h-8 bg-[#B2BDC4]" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">3G</h5>
                    <h3 className="font-bold text-black">15,550</h3>
                  </div>
                  <div className="w-px h-8 bg-[#B2BDC4]" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">4G</h5>
                    <h3 className="font-bold text-black">19,550</h3>
                  </div>
                  <div className="w-px h-8 bg-[#B2BDC4]" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">5G</h5>
                    <h3 className="font-bold text-black">3550</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alarms */}
        <div className="w-full z-10 overflow-hidden rounded-3xl">
          <MapContainer
            center={isMobile ? [35.4279, 59.688] : [32.4279, 53.688]}
            zoom={isMobile ? 3 : 4}
            scrollWheelZoom={false}
            dragging={false}
            zoomControl={false}
            className="h-80 w-full map-alarm"
          >
            <div className="flex h-full flex-col items-start">
              <h1 className="px-3 pt-2 font-bold z-999 text-[12px] text-black">
                Alarms
              </h1>
              <div className="mt-auto flex items-start gap-2 pl-4 pb-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full border-2 border-[#69C19E] bg-[#C1DFDB]" />
                  <h5 className="text-xs text-black">Major</h5>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full border-2 border-[#DF435F] bg-[#E2D3DC]" />
                  <h1 className="text-xs text-black">Critical</h1>
                </div>
              </div>
            </div>
            <TileLayer url="/pattern.png" />
            <GeoJSON
              data={geoJson}
              style={() => mapStyles.alarm}
              onEachFeature={handleFeatureSelection}
            />

            {blinkAlarms.map((p) => (
              <CircleMarker
                key={p.key}
                center={[p.lat, p.lng]}
                radius={13}
                pathOptions={{ className: "blink-dot blink-dot--alarm" }}
              >
                <Tooltip direction="top" opacity={0.9}>
                  {p.name}
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
           <div className="bg-white relative my-2 w-full p-6 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-[#D9DEFF]/60 rounded-lg flex justify-center">
                    <Image
                      src="/location.svg"
                      width={24}
                      height={24}
                      alt="Location"
                    />
                  </div>
                  <h4 className="font-bold text-center">FLOOD</h4>
                </div>
                <h4 className="text-xs text-[#667C89]">5 Provinces</h4>
              </div>
              <div className="my-4 flex justify-between">
                <div className="flex gap-3 text-xs font-bold">
                  Alborz | Tehran | Shiraz
                </div>
                <div className="text-[#00C2A8] text-xs font-bold cursor-pointer">
                  More...
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-[#F9DDD8]/60 rounded-lg flex justify-center">
                    <Image
                      src="/orange_location.svg"
                      width={24}
                      height={24}
                      alt="Location"
                    />
                  </div>
                  <h4 className="font-bold text-center">EARTHQUACKE</h4>
                </div>
                <h4 className="text-xs text-[#667C89]">0 Provinces</h4>
              </div>
              <div className="bg-[#ECEFF1] my-4 w-full h-12 rounded-lg border border-[#D0D8DB] flex items-center justify-center">
                <h5 className="text-center text-[#667C89]">
                  No Earthquacke Reported!
                </h5>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-[#F8D3D9]/60 rounded-lg flex justify-center">
                    <Image
                      src="/red_location.svg"
                      width={24}
                      height={24}
                      alt="Location"
                    />
                  </div>
                  <h4 className="font-bold text-center">FIRE</h4>
                </div>
                <h4 className="text-xs text-[#667C89]">1 Provinces</h4>
              </div>
              <div className="flex gap-3 text-xs mb-18 pt-4 font-bold">
                Tehran
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-22 bg-[#ECEFF1] flex items-center justify-center text-sm text-[#667C89] rounded-b-2xl z-10">
                <div className="flex gap-8">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">2G</h5>
                    <h3 className="font-bold text-black">13,550</h3>
                  </div>
                  <div className="w-px h-8 bg-[#B2BDC4]" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">3G</h5>
                    <h3 className="font-bold text-black">15,550</h3>
                  </div>
                  <div className="w-px h-8 bg-[#B2BDC4]" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">4G</h5>
                    <h3 className="font-bold text-black">19,550</h3>
                  </div>
                  <div className="w-px h-8 bg-[#B2BDC4]" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h5 className="text-[#667C89] text-xs">5G</h5>
                    <h3 className="font-bold text-black">3550</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .province-label {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: #444 !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            pointer-events: none;
            white-space: nowrap;
          }

          .map-news {
            background-color: #f1f4f5 !important;
            border-color: #eceff1;
          }

          .map-cr {
            background-color: #f1f4f5 !important;
            border-color: #eceff1;
          }

          .map-alarm {
            background-color: #f1f4f5 !important;
            border-color: #eceff1;
          }

          .leaflet-container:focus,
          .leaflet-interactive:focus,
          .leaflet-interactive {
            outline: none !important;
          }

          .blink-dot {
            animation: pulseDot 2.5s ease-out infinite;
            transform-origin: center;
          }

          .blink-dot--news {
            fill: #f8d3d9;
            stroke: #df2040;
            stroke-width: 2;
          }

          .blink-dot--cr {
            fill: #d9deff;
            stroke: #465ffe;
            stroke-width: 2;
          }

          .blink-dot--alarm {
            fill: #c2e6d7;
            stroke: #30ae77;
            stroke-width: 2;
          }

          @keyframes pulseDot {
            0% {
              opacity: 1;
              stroke-opacity: 0.75;
              stroke-width: 3;
            }
            60% {
              opacity: 0.55;
              stroke-opacity: 0.32;
              stroke-width: 12;
            }
            100% {
              opacity: 1;
              stroke-opacity: 0.75;
              stroke-width: 3;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
