"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="bg-black flex justify-center items-center">
        <Image
          src="/ce_logo.webp"
          alt="CE_LOGO"
          width="500"
          height="500"
          className="absolute z-1 transition-transform duration-300 ease-in-out hover:scale-110"
          draggable="false"
        />
        <video className="w-100 opacity-50 z-0" muted autoPlay loop>
          <source src="/ce_hero_footage_zoomed.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
