"use client";

import { Scissors } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-bg">
      {/* Icon gunting animasi */}
      <div className="relative">
        <Scissors
          size={70}
          className="text-primary animate-cutting"
        />
      </div>

      {/* Text loading */}
      <p className="mt-4 text-gray-700 font-medium tracking-wide">
        Sharpening the scissors ...
      </p>
    </div>
  );
}
