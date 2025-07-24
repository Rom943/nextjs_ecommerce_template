// Product types
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discount: number | null;
  mainImageUrl: string | null;
  productGalleryUrls: string[] | null;
  rating: number | null;
  stock: number;
  productAttributes: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  categories: ProductCategory[];
}

// Product Category types
export interface ProductCategory {
  id: number;
  name: string;
  subCategories: Record<string, any> | null;
  description: string | null;
  thumbnailImageUrl: string | null;
  HeroImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Form data interfaces
export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  discount: string;
  mainImageUrl: string | null;
  productGalleryUrls: string[];
  stock: string;
  categoryIds: number[];
  productAttributes: Record<string, any>;
}

export interface CategoryFormData {
  name: string;
  description: string;
  thumbnailImageUrl: string | null;
  HeroImageUrl: string | null;
  subCategories: Record<string, any>;
}
