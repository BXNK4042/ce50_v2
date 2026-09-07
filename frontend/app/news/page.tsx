"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/types/news-item";
import Image from "next/image";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function getNews() {
      const response = await fetch("http://localhost:8000/news");
      setNews(await response.json());
    }

    getNews();
  }, []);

  return (
    <div className="container py-4">
      {/*
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.news_id}>
                <td>{item.news_id}</td>
                <td>{item.news_title}</td>
                <td>{item.news_category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      */}

      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          {news.map((item) => (
            <div className="carousel-item active" key={item.news_id}>
              <Image
                src={`http://localhost:8000/uploads/news/${item.news_image}`}
                alt={item.news_title}
                width={1500}
                height={1500}
              />
              <div className="carousel-caption d-none d-md-block text-black bg-white">
                <h3>{item.news_title}</h3>
                <p>{item.news_description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
