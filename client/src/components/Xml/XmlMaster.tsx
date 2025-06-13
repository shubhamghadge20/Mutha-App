import { useEffect, useState } from "react";
import socket from "@/services/socket";
import { Product } from "@/types";
import { getProducts } from "@/features/product/productAPI";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  lockFurnaceThunk,
  unlockFurnaceThunk,
  mqttenableThunk,
  mqttdisableThunk,
} from "@/features/mqtt";
import { RootState } from "@/store";

const XmlMaster = () => {
  const userRole = useAppSelector((state: RootState) => state.auth.user?.role);
  const isAdmin = userRole === "admin";
  const dispatch = useAppDispatch();

  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [productList, setProductList] = useState<Product[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [lockStatus, setLockStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mqttStatus, setMqttStatus] = useState<"enabled" | "disabled">(
    "enabled"
  );
  const [error, setError] = useState<string | null>(null);

  const onUpdate = (data: any) => {
    setComparisonData(data);

    const isLocked = data?.comparisonResults?.some(
      (item: any) => !item.inTolerance
    );
    setLockStatus(isLocked);

    setLoading(false);
    setError(null);
  };

  const onError = (err: any) => {
    setError(err.message || "Unknown error");
    setLoading(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        if (Array.isArray(res.results)) {
          setProductList(res.results);
          const saved = localStorage.getItem("selectedProduct");
          const initial =
            saved && res.results.some((p: Product) => p.name === saved)
              ? saved
              : res.results[0]?.name || "";
          setSelectedProduct(initial);
        }
      } catch {
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const enableMqttByDefault = async () => {
      try {
        await dispatch(mqttenableThunk()).unwrap();
        if (mqttStatus === "disabled") setMqttStatus("enabled");
      } catch (err) {
        console.error("Failed to enable MQTT on start:", err);
      }
    };

    enableMqttByDefault();
  }, [dispatch]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      if (selectedProduct) {
        socket.emit("startComparison", selectedProduct);
        setLoading(true);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("comparisonUpdate", onUpdate);
    socket.on("comparisonError", onError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("comparisonUpdate", onUpdate);
      socket.off("comparisonError", onError);
      if (process.env.NODE_ENV === "production") {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedProduct && socket.connected) {
      localStorage.setItem("selectedProduct", selectedProduct);
      setComparisonData(null);
      socket.emit("startComparison", selectedProduct);
      setLoading(true);
    }
  }, [selectedProduct]);

  const handleRefresh = () => {
    if (selectedProduct && socket.connected) {
      socket.emit("startComparison", selectedProduct);
      setLoading(true);
    }
  };

  useEffect(() => {
    if (!comparisonData) return;
    console.log("Lock status : ", lockStatus);
    if (mqttStatus === "enabled") {
      if (lockStatus) {
        dispatch(lockFurnaceThunk());
      } else {
        dispatch(unlockFurnaceThunk());
      }
    } else {
      dispatch(unlockFurnaceThunk());
    }
  }, [lockStatus, mqttStatus, dispatch]);

  const handleToggleMqtt = async () => {
    try {
      if (mqttStatus === "enabled") {
        await dispatch(mqttdisableThunk()).unwrap();
        setMqttStatus("disabled");
      } else {
        await dispatch(mqttenableThunk()).unwrap();
        setMqttStatus("enabled");
      }
    } catch (err) {
      console.error("MQTT toggle failed:", err);
    }
  };

  const formattedDate = comparisonData?.date
    ? new Date(comparisonData.date).toLocaleDateString()
    : "";
  const formattedTime = comparisonData?.date
    ? new Date(comparisonData.date).toLocaleTimeString()
    : "";

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
            {productList.map((product: Product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto sm:ml-auto mt-2 sm:mt-6">
          <button
            onClick={handleRefresh}
            className="cursor-pointer px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            Refresh File
          </button>

          {isAdmin && (
            <button
              onClick={handleToggleMqtt}
              className={`cursor-pointer px-5 py-2 rounded-xl font-semibold transition ${
                mqttStatus === "enabled"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {mqttStatus === "enabled" ? "Disable MQTT" : "Enable MQTT"}
            </button>
          )}

          {lockStatus && mqttStatus === "enabled" && isAdmin && (
            <button
              onClick={() => {
                setLockStatus(false);
                dispatch(unlockFurnaceThunk());
              }}
              className="cursor-pointer px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Unlock
            </button>
          )}
        </div>
      </div>

      {loading && <p className="text-blue-600 font-medium">Loading...</p>}
      {error && <p className="text-red-600 font-medium">Error: {error}</p>}

      {comparisonData && (
        <div className="bg-white border border-gray-700 rounded-xl p-6 space-y-3 text-stone-700 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">Sample Name:</span>{" "}
              {comparisonData.sampleName}
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
                  !lockStatus ? "text-green-600" : "text-red-600"
                }`}
              >
                {!lockStatus ? "OK" : "Not OK"}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default XmlMaster;
