import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
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
  const [formData, setFormData] = useState<UpdateProductInterface>();
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  const toggleProductExpand = (id: string) =>
    setExpandedProductId((prev) => (prev === id ? null : id));

  const handleCancelCreateProduct = () => setShowCreateProductModal(false);
  const handleCancelUpdateProduct = () => {
    setShowUpdateProductModal(false);
    setSelectedId(null);
  };
  const handleCancelDelete = () => {
    setShowAlert(false);
    setSelectedId(null);
  };

  const onUpdate = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setFormData({ id: product.id, name: product.name, items: product.items });
    setSelectedId(id);
    setShowUpdateProductModal(true);
  };

  const onDelete = (id: string) => {
    setSelectedId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) dispatch(deleteProductThunk(selectedId));
    setShowAlert(false);
    setSelectedId(null);
  };

  const handleConfirmUpdateProduct = () => {
    if (formData) {
      dispatch(updateProductThunk({ id: formData.id, formData }));
      setShowUpdateProductModal(false);
      setFormData(undefined);
      setSelectedId(null);
    }
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

      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 font-serif">
            🛠️ Product Management
          </h2>
          <button
            onClick={() => setShowCreateProductModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-2"
          >
            <FaPlus /> Create Product
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        )}
        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const isExpanded = expandedProductId === product.id;
              return (
                <div
                  key={product.id}
                  className={`bg-white/80 backdrop-blur-md shadow-2xl border border-gray-200 rounded-xl overflow-hidden hover:shadow-blue-300 transition`}
                >
                  <div
                    onClick={() => toggleProductExpand(product.id)}
                    className="p-5 cursor-pointer flex justify-between items-center"
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      {product.name}
                    </h3>
                    <span className="text-gray-500">
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-4 space-y-3 animate-fade-in">
                      {product.items.length > 0 ? (
                        product.items.map((item: ProductItem, idx: number) => (
                          <div
                            key={item.id ?? `${item.name}-${idx}`}
                            className="bg-gray-100 p-3 rounded-md border border-gray-300"
                          >
                            <p className="text-sm font-semibold text-gray-700">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Upper:{" "}
                              <span className="text-green-700 font-medium">
                                {item.uppertolerance}
                              </span>{" "}
                              | Lower:{" "}
                              <span className="text-red-700 font-medium">
                                {item.lowertolerance}
                              </span>
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No items found.</p>
                      )}
                    </div>
                  )}

                  <div className="border-t flex justify-end gap-4 px-5 py-3 bg-gray-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate(product.id);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-500 text-lg mt-10">
              No products found. Try adding one!
            </p>
          )
        )}
      </div>
    </>
  );
};

export default ProductsMaster;
