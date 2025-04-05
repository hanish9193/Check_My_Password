
import { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";

export function SplineBackground() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="fixed inset-0 -z-10">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
        </div>
      )}
      <Spline
        scene="https://prod.spline.design/MDx5-7VLEpqrc3HZ/scene.splinecode"
        onLoad={() => setLoading(false)}
        className="w-full h-full"
      />
      {/* Watermark cover - positioned at bottom-right corner with black background */}
      <div className="absolute bottom-0 right-0 w-52 h-20 bg-black z-10"></div>
    </div>
  );
}
