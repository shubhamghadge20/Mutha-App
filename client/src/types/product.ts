export interface ProductItem {
  id?: string; // alias for _id
  _id?: string; // optional, original from DB
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
  id: string; // Make id required for update (better practice)
  name: string;
  items: ProductItem[];
}
