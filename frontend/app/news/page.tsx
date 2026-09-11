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
    <div className="template-container">
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
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">ข่าวสาร</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          {news.map((item) => (
            <div className="carousel-item active" key={item.news_id}>
              <Image
                src={`http://localhost:8000/uploads/news/${item.news_image}`}
                alt={item.news_title}
                width={2000}
                height={2000}
              />
              <div className="carousel-caption d-none d-md-block text-black bg-white opacity-80">
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

{
  /*
  <div class="editors-news">
    <div class="row">
      <div class="col-lg-3">
        <div class="d-flex position-relative float-left">
          <h3 class="section-title">Popular News</h3>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6  mb-5 mb-sm-2">
        <div class="position-relative image-hover">
          <img
            src="assets/images/dashboard/glob.jpg"
            class="img-fluid"
            alt="world-news"
          />
          <span class="thumb-title">NEWS</span>
        </div>
        <h1 class="font-weight-600 mt-3">
          Melania Trump speaks about courage at State Department
        </h1>
        <p class="fs-15 font-weight-normal">
          Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type
          and
        </p>
      </div>
      <div class="col-lg-6  mb-5 mb-sm-2">
        <div class="row">
          <div class="col-sm-6  mb-5 mb-sm-2">
            <div class="position-relative image-hover">
              <img
                src="assets/images/dashboard/star-magazine-5.jpg"
                class="img-fluid"
                alt="world-news"
              />
              <span class="thumb-title">POLITICS</span>
            </div>
            <h5 class="font-weight-600 mt-3">
              A look at California's eerie plane graveyards
            </h5>
            <p class="fs-15 font-weight-normal">
              Lorem Ipsum has been the industry's standard dummy text
            </p>
          </div>
          <div class="col-sm-6  mb-5 mb-sm-2">
            <div class="position-relative image-hover">
              <img
                src="assets/images/dashboard/star-magazine-6.jpg"
                class="img-fluid"
                alt="world-news"
              />
              <span class="thumb-title">TRAVEL</span>
            </div>
            <h5 class="font-weight-600 mt-3">
              The world's most beautiful racecourses
            </h5>
            <p class="fs-15 font-weight-normal">
              Lorem Ipsum has been the industry's standard dummy text
            </p>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-sm-6  mb-5 mb-sm-2">
            <div class="position-relative image-hover">
              <img
                src="assets/images/dashboard/star-magazine-7.jpg"
                class="img-fluid"
                alt="world-news"
              />
              <span class="thumb-title">POLITICS</span>
            </div>
            <h5 class="font-weight-600 mt-3">
              Japan cancels cherry blossom festivals over virus fears
            </h5>
            <p class="fs-15 font-weight-normal">
              Lorem Ipsum has been the industry's standard dummy text
            </p>
          </div>
          <div class="col-sm-6">
            <div class="position-relative image-hover">
              <img
                src="assets/images/dashboard/star-magazine-8.jpg"
                class="img-fluid"
                alt="world-news"
              />
              <span class="thumb-title">TRAVEL</span>
            </div>
            <h5 class="font-weight-600 mt-3">
              Classic cars reborn as electric vehicles
            </h5>
            <p class="fs-15 font-weight-normal">
              Lorem Ipsum has been the industry's standard dummy text
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
*/
}
