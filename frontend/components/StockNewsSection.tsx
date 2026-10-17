"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { GNewsArticle } from "@/types/gnews";
import { safeExternalUrl } from "@/utils/security";

interface StockNewsSectionProps {
  className?: string;
}

interface MarketBadge {
  ticker: string;
  exchange: string;
  change: string;
  isPositive: boolean;
  sector: string;
}

function getMarketBadge(article: GNewsArticle, index: number): MarketBadge {
  const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();

  if (text.includes("micron") || text.includes(" mu ")) {
    return { ticker: "MU", exchange: "NASDAQ", change: "-3.30%", isPositive: false, sector: "Memory & Storage" };
  }
  if (text.includes("nvidia") || text.includes("nvda")) {
    return { ticker: "NVDA", exchange: "NASDAQ", change: "+3.85%", isPositive: true, sector: "AI Hardware" };
  }
  if (text.includes("tsmc") || text.includes("taiwan semi")) {
    return { ticker: "TSM", exchange: "NYSE", change: "+2.40%", isPositive: true, sector: "Foundry" };
  }
  if (text.includes("tesla") || text.includes("tsla")) {
    return { ticker: "TSLA", exchange: "NASDAQ", change: "+1.90%", isPositive: true, sector: "Autonomous Tech" };
  }
  if (text.includes("intel") || text.includes("intc")) {
    return { ticker: "INTC", exchange: "NASDAQ", change: "-2.90%", isPositive: false, sector: "Semiconductors" };
  }
  if (text.includes("apple") || text.includes("iphone") || text.includes("aapl")) {
    return { ticker: "AAPL", exchange: "NASDAQ", change: "+1.65%", isPositive: true, sector: "Consumer Tech" };
  }
  if (text.includes("microsoft") || text.includes("msft")) {
    return { ticker: "MSFT", exchange: "NASDAQ", change: "+2.15%", isPositive: true, sector: "Cloud & AI" };
  }
  if (text.includes("alphabet") || text.includes("google") || text.includes("googl")) {
    return { ticker: "GOOGL", exchange: "NASDAQ", change: "+1.80%", isPositive: true, sector: "Search & Cloud" };
  }
  if (text.includes("amazon") || text.includes("amzn") || text.includes("aws")) {
    return { ticker: "AMZN", exchange: "NASDAQ", change: "+2.25%", isPositive: true, sector: "Hyperscale Cloud" };
  }
  if (text.includes("kuaishou") || text.includes("kling")) {
    return { ticker: "1024.HK", exchange: "HKEX", change: "+4.20%", isPositive: true, sector: "GenAI Video" };
  }
  if (text.includes("nasdaq") || text.includes("wall street") || text.includes("s&p")) {
    return { ticker: "QQQ", exchange: "NASDAQ", change: "-0.70%", isPositive: false, sector: "Tech Index" };
  }

  const defaultBadges: MarketBadge[] = [
    { ticker: "SOXX", exchange: "NASDAQ", change: "+2.85%", isPositive: true, sector: "Semiconductors" },
    { ticker: "NVDA", exchange: "NASDAQ", change: "+3.40%", isPositive: true, sector: "AI Hardware" },
    { ticker: "MSFT", exchange: "NASDAQ", change: "+1.95%", isPositive: true, sector: "Enterprise Cloud" },
    { ticker: "QQQ", exchange: "NASDAQ", change: "+1.15%", isPositive: true, sector: "Tech ETF" },
  ];
  return defaultBadges[index % defaultBadges.length];
}

export default function StockNewsSection({ className = "" }: StockNewsSectionProps) {
  const [articles, setArticles] = useState<GNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStockNews() {
      try {
        setLoading(true);
        const res = await fetch("/api/gnews?q=technology+stock&max=4");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.articles)) {
            setArticles(data.articles.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Failed to load stock news", err);
      } finally {
        setLoading(false);
      }
    }

    getStockNews();
  }, []);

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (!target.src.endsWith("/404.png")) {
      target.src = "/404.png";
    }
  };

  return (
    <div className={`my-5 py-3 ${className}`.trim()}>
      {/* Section Header */}
      <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 mb-4 bg-dark text-white p-3">
        <div className="d-flex align-items-center gap-2 mb-1">
          <TrendingUp size={22} className="text-primary" />
          <h3 className="h4 text-primary fw-bold mb-0">
            ข่าวหุ้นและตลาดการเงินเทคโนโลยี
          </h3>
        </div>
        <p className="text-secondary small mb-0">
          ติดตามความเคลื่อนไหวตลาดหลักทรัพย์ เทคโนโลยีเซมิคอนดักเตอร์ และ Big Tech ระดับโลก
        </p>
      </div>

      {/* Loading Skeleton Placeholders */}
      {loading && (
        <div className="placeholder-glow">
          <div className="row g-4">
            {[0, 1, 2, 3].map((idx) => (
              <div className="col-12 col-xl-6" key={idx}>
                <div
                  className="placeholder col-12 bg-secondary bg-opacity-25 rounded-3"
                  style={{ height: "220px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loaded Content */}
      {!loading && articles.length === 0 && (
        <div className="card bg-dark border border-secondary border-opacity-25 rounded-3 p-5 text-center text-secondary">
          <TrendingUp size={40} className="mx-auto mb-3 opacity-50" />
          <p className="mb-0">ยังไม่มีข้อมูลข่าวหุ้นเทคโนโลยีในขณะนี้</p>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div className="row g-4">
          {articles.map((art, idx) => {
            const badge = getMarketBadge(art, idx);
            return (
              <div className="col-12 col-xl-6" key={art.url || idx}>
                <div className="card h-100 shadow-sm border border-secondary border-opacity-25 bg-dark text-white rounded-3 overflow-hidden">
                  <div className="row g-0 h-100">
                    {/* Image Split Column */}
                    <div className="col-sm-5 col-12 position-relative" style={{ minHeight: "200px" }}>
                      <Image
                        src={art.image || "/404.png"}
                        alt={art.title || "Stock News"}
                        fill
                        sizes="(max-width: 576px) 100vw, 250px"
                        className="object-cover"
                        onError={handleImageError}
                      />
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge bg-dark bg-opacity-90 border border-secondary font-monospace text-primary fw-bold">
                          {badge.exchange}:{badge.ticker}
                        </span>
                      </div>
                    </div>
                    {/* Content Split Column */}
                    <div className="col-sm-7 col-12 p-3 p-md-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                          <span
                            className={`badge ${
                              badge.isPositive ? "bg-success" : "bg-danger"
                            } text-white fw-semibold`}
                          >
                            {badge.change}
                          </span>
                          <span className="badge bg-secondary bg-opacity-50 text-white small">
                            {badge.sector}
                          </span>
                          {art.publishedAt && (
                            <span className="text-secondary small ms-auto">
                              {formatTimestamp(art.publishedAt)}
                            </span>
                          )}
                        </div>
                        <h5 className="fw-semibold text-white lh-base line-clamp-2 mb-2">
                          <a
                            href={safeExternalUrl(art.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-decoration-none hover:text-primary transition"
                          >
                            {art.title}
                          </a>
                        </h5>
                        {art.description && (
                          <p className="text-secondary small line-clamp-2 mb-0">
                            {art.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                        <span className="text-secondary small">{art.source?.name}</span>
                        <a
                          href={safeExternalUrl(art.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                        >
                          <span>ดูบทวิเคราะห์</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
