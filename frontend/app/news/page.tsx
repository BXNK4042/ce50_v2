"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/types/news-item";

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
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Title</th><th>Category</th></tr></thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.news_id}>
              <td>{item.news_id}</td><td>{item.news_title}</td><td>{item.news_category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
