import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { ProductItem, UpdateProductInterface } from "@/types";
import {
  deleteProductThunk,
  getProductsThunk,
  updateProductThunk,
} from "@/features/product";
import AlertModal from "../@/ui/AlertModal";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";

const ProductsMaster = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);

  const [showAlert, setShowAlert] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [showUpdateProductModal, setShowUpdateProductModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    UpdateProductInterface | undefined
  >();

  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  const handleCancelCreateProduct = () => {
    setShowCreateProductModal(false);
  };

  const onUpdate = (id: string) => {
    const product = products.find((p) => p.id === id);
    setSelectedId(id);
    setFormData({
      id: product?.id || "",
      name: product?.name || "",
      items: product?.items || [],
    });
    setShowUpdateProductModal(true);
  };

  const handleConfirmUpdateProduct = () => {
    if (formData) {
      dispatch(updateProductThunk({ id: formData.id, formData }));
      setShowUpdateProductModal(false);
      setFormData(undefined);
      setSelectedId(null);
    }
  };

  const handleCancelUpdateProduct = () => {
    setShowUpdateProductModal(false);
    setSelectedId(null);
  };

  const onDelete = (id: string) => {
    setSelectedId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      try {
        dispatch(deleteProductThunk(selectedId));
      } catch (error: any) {
        console.error(error);
        toast.error("Delete operation failed");
      }
    }
    setShowAlert(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
    setSelectedId(null);
  };

  return (
    <>
      <AlertModal
        open={showAlert}
        message="Are you sure you want to delete this product?"
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <CreateProductModal
        open={showCreateProductModal}
        onClose={handleCancelCreateProduct}
      />

      <UpdateProductModal
        open={showUpdateProductModal}
        onClose={handleCancelUpdateProduct}
        formData={formData}
        onConfirm={handleConfirmUpdateProduct}
        setFormData={setFormData}
      />

      <div className="w-full max-w-8xl mx-auto bg-white shadow-xl border border-gray-200 overflow-hidden m-8">
        <div className="flex justify-between px-8 py-6 border-b bg-green-100">
          <h2 className="text-3xl font-bold text-stone-800 font-serif">
            Product Management
          </h2>
          <button
            onClick={() => setShowCreateProductModal(true)}
            className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
          >
            <FaPlus className="me-2" /> Create Product
          </button>
        </div>

        {loading && <p className="p-6 text-stone-600">Loading products...</p>}
        {error && (
          <p className="p-6 text-red-600 font-medium">Error: {error}</p>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-stone-800">
                  {product.name}
                </h3>

                <div className="mt-2">
                  {product.items?.length > 0 ? (
                    product.items.map((item: ProductItem) => (
                      <div
                        key={item.name}
                        className="text-stone-600 text-sm mt-1"
                      >
                        <p>
                          <strong>{item.name}</strong>
                        </p>
                        <p>Value: {item.value}</p>
                        <p>
                          Tolerance:{" "}
                          <span className="font-medium">
                            Upper: {item.uppertolerance} - Lower:{" "}
                            {item.lowertolerance}
                          </span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-stone-400">No items available</p>
                  )}
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => onUpdate(product.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="px-8 py-6 text-stone-500 text-sm">
              No products found. Please add a new product.
            </p>
          )
        )}
      </div>
    </>
  );
};

export default ProductsMaster;
