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
        <table classNameName="table table-striped">
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
      <div className="editors-news text-light">
        <div className="row">
          <div className="col-lg-3">
            <div className="position-relative float-left">
              <div className="mt-5 mb-5">
                <h1 className="text-primary">ข่าวสารล่าสุด</h1>
                <div className="bg-blue-500 w-100 h-1"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6  mb-5 mb-sm-2">
            <div className="position-relative image-hover">
              <Image
                src="/404.png"
                className="img-fluid"
                alt="ce50-news"
                width={700}
                height={700}
              />
            </div>
            <h1 className="font-weight-600 mt-3">
              Melania Trump speaks about courage at State Department
            </h1>
          </div>
          <div className="col-lg-6  mb-5 mb-sm-2">
            <div className="row">
              <div className="col-sm-6  mb-5 mb-sm-2">
                <div className="position-relative image-hover">
                  <Image
                    src="/404.png"
                    className="img-fluid"
                    alt="ce50-news"
                    width={700}
                    height={700}
                  />
                </div>
                <h5 className="font-weight-600 mt-3">
                  A look at California's eerie plane graveyards
                </h5>
              </div>
              <div className="col-sm-6  mb-5 mb-sm-2">
                <div className="position-relative image-hover">
                  <Image
                    src="/404.png"
                    className="img-fluid"
                    alt="ce50-news"
                    width={700}
                    height={700}
                  />
                </div>
                <h5 className="font-weight-600 mt-3">
                  The world's most beautiful racecourses
                </h5>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-6  mb-5 mb-sm-2">
                <div className="position-relative image-hover">
                  <Image
                    src="/404.png"
                    className="img-fluid"
                    alt="ce50-news"
                    width={700}
                    height={700}
                  />
                </div>
                <h5 className="font-weight-600 mt-3">
                  Japan cancels cherry blossom festivals over virus fears
                </h5>
              </div>
              <div className="col-sm-6">
                <div className="position-relative image-hover">
                  <Image
                    src="/404.png"
                    className="img-fluid"
                    alt="ce50-news"
                    width={700}
                    height={700}
                  />
                </div>
                <h5 className="font-weight-600 mt-3">
                  classNameic cars reborn as electric vehicles
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="world-news text-light">
        <div className="row">
          <div className="col-sm-12">
            <div className="d-flex position-relative  float-left">
              <div className="mt-5 mb-5">
                <h1 className="text-primary">ข่าวสารต่างประเทศ</h1>
                <div className="bg-blue-500 w-100 h-1"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-sm-6 grid-margin mb-5 mb-sm-2">
            <div className="position-relative image-hover">
              <Image
                src="/404.png"
                className="img-fluid"
                alt="ce50-news"
                width={700}
                height={700}
              />
            </div>
            <h5 className="font-weight-bold mt-3">
              Refugees flood Turkey's border with Greece
            </h5>
            <p className="fs-15 font-weight-normal">
              Lorem Ipsum has been the industry's standard dummy text
            </p>
          </div>
          <div className="col-lg-3 col-sm-6 mb-5 mb-sm-2">
            <div className="position-relative image-hover">
              <Image
                src="/404.png"
                className="img-fluid"
                alt="ce50-news"
                width={700}
                height={700}
              />
            </div>
            <h5 className="font-weight-bold mt-3">
              South Korea’s Moon Jae-in sworn in vowing address
            </h5>
            <p className="fs-15 font-weight-normal">
              Lorem Ipsum has been the industry's standard dummy text
            </p>
          </div>
          <div className="col-lg-3 col-sm-6 mb-5 mb-sm-2">
            <div className="position-relative image-hover">
              <Image
                src="/404.png"
                className="img-fluid"
                alt="ce50-news"
                width={700}
                height={700}
              />
            </div>
            <h5 className="font-weight-bold mt-3">
              These puppies are training to assist in avalanche rescue
            </h5>
            <p className="fs-15 font-weight-normal">
              Lorem Ipsum has been the industry's standard dummy text
            </p>
          </div>
          <div className="col-lg-3 col-sm-6 mb-5 mb-sm-2">
            <div className="position-relative image-hover">
              <Image
                src="/404.png"
                className="img-fluid"
                alt="ce50-news"
                width={700}
                height={700}
              />
            </div>
            <h5 className="font-weight-bold mt-3">
              'Love Is Blind' couple opens up about their first year
            </h5>
            <p className="fs-15 font-weight-normal">
              Lorem Ipsum has been the industry's standard dummy text
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
