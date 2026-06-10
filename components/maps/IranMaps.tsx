"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useMemo } from "react";
import ProvinceMap from "./ProvinceMap";

type Props = {
  geoJson: any;
  onSelect?: (feature: any) => void;
};

export default function IranMap({ geoJson, onSelect }: Props) {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const mapStyles = useMemo(
    () => ({
      default: {
        fillColor: "#B2C7D4",
        weight: 1,
        color: "#fff",
        fillOpacity: 0.9,
      },
      hover: { fillColor: "#465FFF", weight: 2, color: "#fff", fillOpacity: 1 },
    }),
    [],
  );

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
        const target = e.target as L.Path;
        target.setStyle(mapStyles.default);
        (layer as any).closeTooltip();
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex py-5 items-center">
        <div className="grow border-t border-gray-300"></div>
        <span className="shrink mx-4 text-gray-500 dark:text-gray-200">OSS Maps Data</span>
        <div className="grow border-t border-gray-300"></div>
      </div>
      <div className="flex flex-col lg:flex-row mt-2 lg:mt-0  h-auto w-full gap-2 overflow-hidden">
        <div className="relative z-10 overflow-hidden rounded-2xl">
          <MapContainer
            center={[32.4279, 53.688]}
            zoom={isMobile ? 4 : 5}
            zoomControl={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            dragging={false}
            className="h-120 w-220 bg-[#F1F4F5]!"
          >
            <TileLayer url="/pattern.png"  />
            <GeoJSON
              data={geoJson}
              style={() => mapStyles.default}
              onEachFeature={handleFeatureSelection}
            />
          </MapContainer>
        </div>

        <div className="w-full lg:w-[50%] h-full">
          <ProvinceMap selectedProvince={selectedProvince} />
        </div>
        
      </div>
    </div>
  );
}
