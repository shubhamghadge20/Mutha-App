export interface ProductItem {
  id?: string;
  _id?: string;
  name: string;
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
  _id?: string;
  name: string;
  items: ProductItem[];
}
