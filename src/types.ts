export interface Game {
  id: string;
  title: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  version: string;
  genres: string[];
  platforms: string[];
  rating: number;
  reviewScore: string;
  coverUrl: string;
  bannerUrl: string;
  logoUrl: string;
  screenshots: string[];
  story: string;
  description: string;
  features: string[];
  systemRequirements: {
    minimum: string;
    recommended: string;
  };
  downloadLinks: { title: string; url: string }[];
  categories: string[];
  featured: boolean;
  trending: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
}
