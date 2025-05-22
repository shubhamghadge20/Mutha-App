import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchXmlComparisonThunk } from "@/features/xml/xmlSlice";
import { getProducts } from "@/features/product/productAPI";
import { Product } from "@/types";

const XmlMaster = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.xml);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        if (Array.isArray(res.results)) {
          setProductList(res.results);

          const savedProduct = localStorage.getItem("selectedProduct");
          const initialProduct =
            savedProduct &&
            res.results.some((p: Product) => p.name === savedProduct)
              ? savedProduct
              : res.results[0]?.name;

          setSelectedProduct(initialProduct || "");
        }
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      dispatch(fetchXmlComparisonThunk(selectedProduct));
      localStorage.setItem("selectedProduct", selectedProduct);
    }
  }, [selectedProduct, dispatch]);

  const handleRefresh = () => {
    if (selectedProduct) {
      dispatch(fetchXmlComparisonThunk(selectedProduct));
    }
  };

  const dateObj = data?.date ? new Date(data.date) : null;
  const formattedDate = dateObj?.toLocaleDateString();
  const formattedTime = dateObj?.toLocaleTimeString();

  const overallStatus = data?.comparisonResults?.some(
    (item) => !item.inTolerance
  )
    ? "Not OK"
    : "OK";

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-stone-800">XML Comparison</h1>

      <div className="flex items-center gap-4">
        <div>
          <label htmlFor="productSelect" className="block mb-1 font-medium">
            Select Product
          </label>
          <select
            id="productSelect"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-4 py-2 border rounded w-full max-w-sm"
          >
            {productList.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRefresh}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh File
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <div className="border p-4 rounded bg-gray-50 space-y-2">
          <p>
            <strong>Latest File:</strong> {data.latestFile}
          </p>
          <p>
            <strong>Sample ID:</strong> {data.sampleName}
          </p>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Time:</strong> {formattedTime}
          </p>
          <p>
            <strong>Overall Status:</strong>{" "}
            <span
              className={`font-bold ${
                overallStatus === "OK" ? "text-green-600" : "text-red-600"
              }`}
            >
              {overallStatus}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default XmlMaster;
