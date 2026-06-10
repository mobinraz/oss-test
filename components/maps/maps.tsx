
import iranGeoJson from "@/public/ir.json";
import dynamic from "next/dynamic";

export default function MapPage() {
  const IranMap = dynamic(() => import("./IranMaps"), {
    ssr: false,
  });
  const NotificationMap = dynamic(() => import("./NotificationMap"), {
    ssr: false,
  });

  return (
    <div className="grid gap-6 px-8" id="maps">
      <IranMap
        geoJson={iranGeoJson as any}
      />
       <NotificationMap
        geoJson={iranGeoJson as any}
      />
    </div>
  );
}
