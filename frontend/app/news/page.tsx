"use client";

import NewsFeed from "@/components/layout/news-feed";
import NewsSlider from "@/components/layout/news-slider";

export default function NewsPage() {
  return (
    <section className="template-container py-6">
      <div className="flex flex-col gap-12">
        {/* Page Header */}
        <div className="mt-4 mb-2">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight">
            วิศวกรรมคอมพิวเตอร์
          </h1>
          <h1 className="text-primary text-3xl md:text-4xl font-extrabold">
            ข่าวสาร
          </h1>
          <div className="bg-blue-500 w-20 h-1 mt-2"></div>
        </div>

        {/* Section 1: ข่าวสารภายใน CE (Vertical Feed: Featured + 2x2 Grid) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 select-none">
            <span className="inline-block w-1.5 h-6 bg-blue-600 rounded-full shrink-0" />
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              ข่าวสารภายใน CE
            </h2>
          </div>
          <NewsFeed excludeArchive={true} />
        </div>

        {/* Section 2: ข่าวสารภายนอก (Infinite Animated Slider) */}
        <div className="flex flex-col gap-6">
          <NewsSlider title="ข่าวสารภายนอก" />
        </div>

        {/* Section 3: ข่าวสารภายใน CE ย้อนหลัง (Archive Grid) */}
        <div className="flex flex-col gap-6">
          <NewsFeed onlyArchive={true} archiveTitle="ข่าวสารภายใน CE ย้อนหลัง" />
        </div>
      </div>
    </section>
  );
}
