export type GNewsArticle = {
  title: string;
  description: string;
  content?: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
  };
};

export type GNewsResponse = {
  totalArticles: number;
  articles: GNewsArticle[];
  fallback?: boolean;
  message?: string;
};
