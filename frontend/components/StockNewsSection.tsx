"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  TrendingUp,
  LayoutGrid,
  Columns2,
  LayoutList,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { GNewsArticle } from "@/types/gnews";
import { safeExternalUrl } from "@/utils/security";

interface StockNewsSectionProps {
  className?: string;
}

type LayoutStyle = "hero" | "split" | "feed";

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
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>("hero");

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
      {/* Switcher & Section Header Bar */}
      <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 mb-4 bg-dark text-white p-3">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
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

          {/* Interactive Style Switcher Controls */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary small d-none d-xl-inline">
              รูปแบบการแสดงผล:
            </span>
            <div className="btn-group" role="group" aria-label="Stock News Layout Switcher">
              <button
                type="button"
                onClick={() => setLayoutStyle("hero")}
                className={`btn btn-sm d-inline-flex align-items-center gap-1.5 ${
                  layoutStyle === "hero"
                    ? "btn-primary"
                    : "btn-dark border border-secondary border-opacity-50 text-light"
                }`}
              >
                <LayoutGrid size={15} />
                <span>Style 1: Hero Showcase</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutStyle("split")}
                className={`btn btn-sm d-inline-flex align-items-center gap-1.5 ${
                  layoutStyle === "split"
                    ? "btn-primary"
                    : "btn-dark border border-secondary border-opacity-50 text-light"
                }`}
              >
                <Columns2 size={15} />
                <span>Style 2: Horizontal Split</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutStyle("feed")}
                className={`btn btn-sm d-inline-flex align-items-center gap-1.5 ${
                  layoutStyle === "feed"
                    ? "btn-primary"
                    : "btn-dark border border-secondary border-opacity-50 text-light"
                }`}
              >
                <LayoutList size={15} />
                <span>Style 3: Structured Feed</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeleton Placeholders */}
      {loading && (
        <div className="placeholder-glow">
          {layoutStyle === "hero" && (
            <div>
              <div
                className="placeholder col-12 bg-secondary bg-opacity-25 rounded-3 mb-4"
                style={{ height: "400px" }}
              />
              <div className="row g-3">
                {[0, 1, 2].map((idx) => (
                  <div className="col-12 col-md-4" key={idx}>
                    <div
                      className="placeholder col-12 bg-secondary bg-opacity-25 rounded-3 mb-2"
                      style={{ height: "180px" }}
                    />
                    <span className="placeholder col-8 bg-secondary bg-opacity-50 d-block py-1 mb-2" />
                    <span className="placeholder col-12 bg-secondary bg-opacity-25 d-block py-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {layoutStyle === "split" && (
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
          )}

          {layoutStyle === "feed" && (
            <div className="card bg-dark border border-secondary border-opacity-25 rounded-3 p-3">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="py-3 border-bottom border-secondary border-opacity-25">
                  <span className="placeholder col-2 bg-primary d-inline-block py-2 me-3" />
                  <span className="placeholder col-7 bg-secondary bg-opacity-50 d-inline-block py-2" />
                </div>
              ))}
            </div>
          )}
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
        <>
          {/* ======================================================== */}
          {/* Style 1: Hero Showcase                                   */}
          {/* ======================================================== */}
          {layoutStyle === "hero" && (
            <div>
              {/* Featured Spotlight Card */}
              {articles[0] && (() => {
                const lead = articles[0];
                const leadBadge = getMarketBadge(lead, 0);
                return (
                  <div className="card shadow-lg border-0 overflow-hidden rounded-3 mb-4 bg-dark text-white position-relative">
                    <div className="position-relative w-100" style={{ height: "420px" }}>
                      <Image
                        src={lead.image || "/404.png"}
                        alt={lead.title || "Featured Stock News"}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        onError={handleImageError}
                        priority
                      />
                      {/* Gradient Overlay */}
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(10,15,30,0.65) 45%, rgba(5,10,20,0.96) 100%)",
                        }}
                      />
                      {/* Content Overlay */}
                      <div className="position-absolute bottom-0 start-0 p-4 p-md-5 w-100 z-1">
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                          <span className="badge bg-primary text-white font-monospace px-3 py-1.5 fw-bold">
                            {leadBadge.exchange}: {leadBadge.ticker}
                          </span>
                          <span
                            className={`badge ${
                              leadBadge.isPositive ? "bg-success" : "bg-danger"
                            } text-white fw-semibold px-2 py-1`}
                          >
                            {leadBadge.change}
                          </span>
                          <span className="badge bg-secondary bg-opacity-75 text-light">
                            {leadBadge.sector}
                          </span>
                          {lead.source?.name && (
                            <span className="badge bg-dark border border-secondary text-light">
                              {lead.source.name}
                            </span>
                          )}
                          {lead.publishedAt && (
                            <span className="text-light text-opacity-75 small d-inline-flex align-items-center gap-1 ms-1">
                              <Calendar size={13} />
                              {formatTimestamp(lead.publishedAt)}
                            </span>
                          )}
                        </div>
                        <h2 className="h3 fw-bold text-white mb-2 text-break">
                          <a
                            href={safeExternalUrl(lead.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-decoration-none hover:text-primary transition"
                          >
                            {lead.title}
                          </a>
                        </h2>
                        {lead.description && (
                          <p className="text-light text-opacity-75 fs-6 line-clamp-2 max-w-3xl mb-3">
                            {lead.description}
                          </p>
                        )}
                        <a
                          href={safeExternalUrl(lead.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary d-inline-flex align-items-center gap-2"
                        >
                          <span>อ่านบทวิเคราะห์ & ข่าวหุ้น</span>
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Remaining Articles Row */}
              <div className="row g-3">
                {articles.slice(1, 4).map((art, idx) => {
                  const badge = getMarketBadge(art, idx + 1);
                  return (
                    <div className="col-12 col-md-4" key={art.url || idx}>
                      <div className="card h-100 shadow-sm border border-secondary border-opacity-25 bg-dark text-white rounded-3 overflow-hidden d-flex flex-column">
                        <div className="position-relative w-100" style={{ height: "180px" }}>
                          <Image
                            src={art.image || "/404.png"}
                            alt={art.title || "Stock News"}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            onError={handleImageError}
                          />
                          <div className="position-absolute top-0 start-0 m-2">
                            <span className="badge bg-dark bg-opacity-80 border border-secondary text-primary font-monospace fw-bold">
                              {badge.ticker} {badge.change}
                            </span>
                          </div>
                        </div>
                        <div className="card-body p-3 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-center gap-1 mb-2">
                              <span className="badge bg-secondary bg-opacity-50 text-white small">
                                {badge.sector}
                              </span>
                              {art.publishedAt && (
                                <span className="text-secondary small">
                                  {formatTimestamp(art.publishedAt)}
                                </span>
                              )}
                            </div>
                            <h6 className="fw-semibold text-white lh-base line-clamp-2 mb-2">
                              {art.title}
                            </h6>
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
                              <span>อ่านข่าว</span>
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* Style 2: Horizontal Split                                */}
          {/* ======================================================== */}
          {layoutStyle === "split" && (
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

          {/* ======================================================== */}
          {/* Style 3: Structured Feed                                 */}
          {/* ======================================================== */}
          {layoutStyle === "feed" && (
            <div className="card shadow-lg border border-secondary border-opacity-25 bg-dark text-white rounded-3 overflow-hidden">
              <div className="card-header bg-black bg-opacity-50 border-bottom border-secondary border-opacity-25 py-3 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 px-2 py-1 font-monospace">
                    LIVE
                  </span>
                  <span className="fw-semibold text-white small">
                    รายการความเคลื่อนไหวตลาดการเงินเทคโนโลยี (Market Ticker Feed)
                  </span>
                </div>
                <span className="text-secondary small">{articles.length} รายการ</span>
              </div>
              <div className="list-group list-group-flush">
                {articles.map((art, idx) => {
                  const badge = getMarketBadge(art, idx);
                  return (
                    <div
                      key={art.url || idx}
                      className="list-group-item bg-dark text-white border-secondary border-opacity-25 p-3 p-md-4"
                    >
                      <div className="row align-items-center g-3">
                        {/* Ticker Block */}
                        <div className="col-auto" style={{ width: "105px" }}>
                          <div className="border border-secondary border-opacity-50 rounded-2 py-1.5 px-2 bg-black text-center font-monospace">
                            <div className="fw-bold text-white small text-truncate">
                              {badge.ticker}
                            </div>
                            <div
                              className={`fw-bold small ${
                                badge.isPositive ? "text-success" : "text-danger"
                              }`}
                              style={{ fontSize: "0.78rem" }}
                            >
                              {badge.change}
                            </div>
                          </div>
                        </div>

                        {/* Thumbnail Image */}
                        <div className="col-auto d-none d-sm-block">
                          <div
                            className="position-relative rounded-2 overflow-hidden"
                            style={{ width: "110px", height: "75px" }}
                          >
                            <Image
                              src={art.image || "/404.png"}
                              alt={art.title || "Thumbnail"}
                              fill
                              sizes="110px"
                              className="object-cover"
                              onError={handleImageError}
                            />
                          </div>
                        </div>

                        {/* Article Details */}
                        <div className="col">
                          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                            <span className="badge bg-secondary bg-opacity-50 text-white small">
                              {badge.sector}
                            </span>
                            {art.source?.name && (
                              <span className="text-secondary small">{art.source.name}</span>
                            )}
                            {art.publishedAt && (
                              <span className="text-secondary small d-inline-flex align-items-center gap-1">
                                <Calendar size={12} />
                                {formatTimestamp(art.publishedAt)}
                              </span>
                            )}
                          </div>
                          <h6 className="fw-semibold text-white mb-1">
                            <a
                              href={safeExternalUrl(art.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-decoration-none hover:text-primary transition"
                            >
                              {art.title}
                            </a>
                          </h6>
                          {art.description && (
                            <p className="text-secondary small mb-0 line-clamp-1">
                              {art.description}
                            </p>
                          )}
                        </div>

                        {/* Action Link Button */}
                        <div className="col-auto text-end">
                          <a
                            href={safeExternalUrl(art.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                          >
                            <span>อ่านข่าว</span>
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
