"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="w-100 overflow-hidden">
      <div className="bg-black flex justify-center items-center relative overflow-hidden min-h-[50vh]">
        <Image
          src="/ce_logo.webp"
          alt="CE_LOGO"
          width="500"
          height="500"
          className="absolute z-1 transition-transform duration-300 ease-in-out hover:scale-110 w-[min(45vw,480px)] h-auto max-w-full"
          draggable="false"
          priority
        />
        <video className="w-100 h-auto object-cover opacity-50 z-0" muted autoPlay loop playsInline>
          <source src="/ce_hero_footage_zoomed.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
