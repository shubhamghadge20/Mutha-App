export interface ProductItem {
  id?: string; // optional for items that exist in DB
  name: string;
  value: number;
  uppertolerance: number;
  lowertolerance: number;
}

export interface Product {
  id: string;
  name: string;
  items: ProductItem[];
}

export interface CreateProductInterface {
  name: string;
  items: ProductItem[];
}

export interface UpdateProductInterface {
  id: string;
  name: string;
  items: ProductItem[];
}
