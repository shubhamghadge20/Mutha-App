import { useEffect, useState } from "react";
import socket from "@/services/socket";
import { Product, FurnaceGateway } from "@/types";
import { getProducts } from "@/features/product/productAPI";
import { getFurnaceGateways } from "@/features/FurnaceGateway/furnaceGatewayAPI";
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
  const [furnaceList, setFurnaceList] = useState<FurnaceGateway[]>([]);
  const [selectedFurnace, setSelectedFurnace] = useState<string>(() => {
    return localStorage.getItem("selectedFurnace") || "";
  });

  const [comparisonData, setComparisonData] = useState<any>(null);
  const [lockStatus, setLockStatus] = useState<boolean>(() => {
    const saved = localStorage.getItem("lockStatus");
    return saved === "true";
  });

  const [loading, setLoading] = useState(false);
  const [mqttStatus, setMqttStatus] = useState<"enabled" | "disabled">(
    () =>
      (localStorage.getItem("mqttStatus") as "enabled" | "disabled") ||
      "enabled"
  );
  const [error, setError] = useState<string | null>(null);

  const onUpdate = (data: any) => {
    setComparisonData(data);
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

    const fetchFurnaces = async () => {
      try {
        const res = await getFurnaceGateways();
        if (Array.isArray(res.results)) {
          setFurnaceList(res.results);
          const saved = localStorage.getItem("selectedFurnace");
          const initial =
            saved &&
            res.results.some((f: FurnaceGateway) => f.furnaceId === saved)
              ? saved
              : "";
          setSelectedFurnace(initial);

          const gatewayMac = res.results.find(
            (f: FurnaceGateway) => f.furnaceId === initial
          )?.gatewayMac;
          if (gatewayMac) {
            localStorage.setItem("gatewayMac", gatewayMac);
          }
        }
      } catch {
        setError("Failed to load furnaces");
      }
    };

    fetchProducts();
    fetchFurnaces();
  }, []);

  useEffect(() => {
    const applySavedMqttStatus = async () => {
      try {
        if (mqttStatus === "enabled") {
          await dispatch(mqttenableThunk()).unwrap();
        } else {
          await dispatch(mqttdisableThunk()).unwrap();
        }
      } catch (err) {
        console.error("Failed to apply MQTT status:", err);
      }
    };

    applySavedMqttStatus();
  }, [dispatch, mqttStatus]);

  useEffect(() => {
    if (!selectedFurnace) return;

    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      socket.emit("selectFurnace", selectedFurnace);
      if (selectedProduct) {
        socket.emit("selectProduct", selectedProduct);
        socket.emit("startComparison", {
          product: selectedProduct,
          furnace: selectedFurnace,
        });
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
    };
  }, [selectedFurnace]);

  useEffect(() => {
    if (!selectedFurnace || !socket.connected || !selectedProduct) return;

    localStorage.setItem("selectedProduct", selectedProduct);
    setComparisonData(null);
    socket.emit("selectProduct", selectedProduct);
    socket.emit("startComparison", {
      product: selectedProduct,
      furnace: selectedFurnace,
    });
    setLoading(true);
  }, [selectedProduct, selectedFurnace]);

  useEffect(() => {
    if (selectedFurnace) {
      localStorage.setItem("selectedFurnace", selectedFurnace);

      const selectedGateway = furnaceList.find(
        (f: FurnaceGateway) => f.furnaceId === selectedFurnace
      );
      const gatewayMac = selectedGateway?.gatewayMac;
      if (gatewayMac) {
        localStorage.setItem("gatewayMac", gatewayMac);
      }
    }
  }, [selectedFurnace, furnaceList]);

  const handleRefresh = () => {
    if (selectedFurnace && selectedProduct && socket.connected) {
      socket.emit("startComparison", {
        product: selectedProduct,
        furnace: selectedFurnace,
      });
      setLoading(true);
    }
  };

  useEffect(() => {
    if (!comparisonData || !selectedFurnace || furnaceList.length === 0) return;

    const selectedGateway = furnaceList.find(
      (f: FurnaceGateway) => f.furnaceId === selectedFurnace
    );
    const gatewayMac = selectedGateway?.gatewayMac;
    if (!gatewayMac) return;

    const backendLock =
      comparisonData.lockStatus === true ||
      comparisonData.lockStatus === "Locked";

    const previousLock = localStorage.getItem("lockStatus") === "true";
    localStorage.setItem("lockStatus", String(backendLock));
    setLockStatus(backendLock);

    if (mqttStatus === "enabled") {
      if (backendLock !== previousLock) {
        if (backendLock) {
          dispatch(lockFurnaceThunk(gatewayMac));
        } else {
          dispatch(unlockFurnaceThunk(gatewayMac));
        }
      }

      if (!backendLock && previousLock === false) {
        dispatch(unlockFurnaceThunk(gatewayMac));
      }
    } else {
      dispatch(unlockFurnaceThunk(gatewayMac));
    }
  }, [comparisonData, selectedFurnace, furnaceList, mqttStatus, dispatch]);

  const handleToggleMqtt = async () => {
    try {
      if (mqttStatus === "enabled") {
        await dispatch(mqttdisableThunk()).unwrap();
        setMqttStatus("disabled");
        localStorage.setItem("mqttStatus", "disabled");
      } else {
        await dispatch(mqttenableThunk()).unwrap();
        setMqttStatus("enabled");
        localStorage.setItem("mqttStatus", "enabled");
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
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
        <div className="w-full sm:w-72">
          <label htmlFor="furnaceSelect">Select Furnace</label>
          <select
            id="furnaceSelect"
            value={selectedFurnace}
            onChange={(e) => setSelectedFurnace(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border bg-stone-50"
          >
            <option value="">-- Select Furnace --</option>
            {furnaceList.map((f: FurnaceGateway) => (
              <option key={f.id} value={f.furnaceId}>
                {f.furnaceId}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-72">
          <label htmlFor="productSelect">Select Product</label>
          <select
            id="productSelect"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border bg-stone-50"
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
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold"
            disabled={loading || !selectedFurnace}
          >
            Refresh File
          </button>

          {isAdmin && (
            <button
              onClick={handleToggleMqtt}
              className={`px-5 py-2 rounded-xl font-semibold ${
                mqttStatus === "enabled"
                  ? "bg-red-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {mqttStatus === "enabled" ? "Disable MQTT" : "Enable MQTT"}
            </button>
          )}

          {lockStatus && mqttStatus === "enabled" && isAdmin && (
            <button
              onClick={() => {
                setLockStatus(false);
                localStorage.setItem("lockStatus", "false");

                const selectedGateway = furnaceList.find(
                  (f: FurnaceGateway) => f.furnaceId === selectedFurnace
                );
                const gatewayMac = selectedGateway?.gatewayMac;
                if (gatewayMac) {
                  dispatch(unlockFurnaceThunk(gatewayMac));
                }
              }}
              className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold"
            >
              Unlock
            </button>
          )}
        </div>
      </div>

      {loading && <p className="text-blue-600 font-medium">Loading...</p>}
      {error && <p className="text-red-600 font-medium">Error: {error}</p>}

      {comparisonData && (
        <div className="border border-gray-300 rounded-xl p-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <strong>Sample Name:</strong> {comparisonData.sampleName}
            </p>
            <p>
              <strong>Date:</strong> {formattedDate}
            </p>
            <p>
              <strong>Time:</strong> {formattedTime}
            </p>
            <p className="col-span-1 sm:col-span-2">
              <strong>Overall Status:</strong>{" "}
              <span className={lockStatus ? "text-red-600" : "text-green-600"}>
                {lockStatus ? "Not OK" : "OK"}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default XmlMaster;
