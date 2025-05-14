import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "./productAPI";

import {
  CreateProductInterface,
  Product,
  UpdateProductInterface,
} from "@types";

import { toast } from "react-toastify";

interface UpdateProductParams {
  id: string;
  formData: UpdateProductInterface;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const createProductThunk = createAsyncThunk(
  "products/createProduct",
  async (formData: CreateProductInterface, { rejectWithValue }) => {
    try {
      const data = await createProduct(formData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Create product failed"
      );
    }
  }
);

export const getProductThunk = createAsyncThunk(
  "products/getProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getProduct(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch product failed"
      );
    }
  }
);

export const getProductsThunk = createAsyncThunk(
  "products/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProducts();
      return data.results;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch product failed"
      );
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }: UpdateProductParams, { rejectWithValue }) => {
    try {
      const data = await updateProduct(id, formData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Update product failed"
      );
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Delete product failed"
      );
    }
  }
);

const processSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        toast.success("Product created sucessfully");
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Create product operation failed");
      })

      .addCase(getProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.products = state.products.map((p) =>
          p.id === updated.id ? updated : p
        );
        toast.success("Product updated sucessfully");
      })

      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Update operation failed");
      })

      .addCase(deleteProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.products = state.products.filter((u) => u.id !== deletedId);
        toast.success("Product deleted sucessfully");
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Delete operation failed");
      });
  },
});

export default processSlice.reducer;
