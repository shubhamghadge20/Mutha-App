export interface ProductItem {
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
  id?: string;
  name?: string;
  items?: ProductItem[];
}

export interface ProductItem {
  _id?: string;
  name: string;
  value: number;
  uppertolerance: number;
  lowertolerance: number;
}
