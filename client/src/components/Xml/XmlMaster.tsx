import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchXmlComparisonThunk } from "@/features/xml/xmlSlice";
import { lockFurnaceThunk, unlockFurnaceThunk } from "@/features/mqtt";
import { getProducts } from "@/features/product/productAPI";
import { Product } from "@/types";

const XmlMaster = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.xml);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [productList, setProductList] = useState<Product[]>([]);
  const [lockStatus, setLockStatus] = useState(false);

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

  useEffect(() => {
    const status = data?.comparisonResults?.some((item) => !item.inTolerance);
    setLockStatus(status || false);
  }, [data]);

  useEffect(() => {
    if (lockStatus) {
      console.log("lock command trigger");
      dispatch(lockFurnaceThunk());
    } else {
      console.log("unlock command trigger");
      dispatch(unlockFurnaceThunk());
    }
  }, [lockStatus, setLockStatus, selectedProduct, dispatch]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-72">
          <label
            htmlFor="productSelect"
            className="block mb-1 text-sm font-medium text-stone-700"
          >
            Select Product
          </label>
          <select
            id="productSelect"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {productList.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 items-center w-full sm:w-auto sm:ml-auto mt-2 sm:mt-6">
          <button
            onClick={handleRefresh}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Refresh File
          </button>
          <button
            onClick={() => {
              dispatch(unlockFurnaceThunk());
              console.log("Manual unlock triggered");
            }}
            className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Unlock
          </button>
        </div>
      </div>

      {loading && <p className="text-blue-600 font-medium">Loading...</p>}
      {error && <p className="text-red-600 font-medium">Error: {error}</p>}

      {data && (
        <div className="bg-white border border-gray-700 rounded-xl p-6 space-y-3 text-stone-700 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">Sample Name:</span>{" "}
              {data.sampleName}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {formattedDate}
            </p>
            <p>
              <span className="font-semibold">Time:</span> {formattedTime}
            </p>
            <p className="col-span-1 sm:col-span-2">
              <span className="font-semibold">Overall Status:</span>{" "}
              <span
                className={`font-bold ${
                  lockStatus === false ? "text-green-600" : "text-red-600"
                }`}
              >
                {lockStatus === false ? "Ok" : "Not Ok"}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default XmlMaster;
