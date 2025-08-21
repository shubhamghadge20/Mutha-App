import { useEffect, useRef } from "react";
import socket from "@/services/socket";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store";
import { lockFurnaceThunk, unlockFurnaceThunk } from "@/features/mqtt";
import { FurnaceGateway } from "@/types";
import { getFurnaceGateways } from "@/features/FurnaceGateway/furnaceGatewayAPI";

export const useGlobalXmlComparisonListener = () => {
  const dispatch = useAppDispatch();

  const mqttStatus = useAppSelector(
    (state: RootState) => state.mqtt.mqttStatus
  );

  const furnaceListRef = useRef<FurnaceGateway[]>([]);

  // 🔧 Utility function to get gatewayMac
  const getGatewayMac = (furnaceId: string): string | undefined => {
    const gateway = furnaceListRef.current.find(
      (f: FurnaceGateway) => f.furnaceId === furnaceId
    );
    return gateway?.gatewayMac;
  };

  // 🔁 Load furnace list once
  useEffect(() => {
    getFurnaceGateways().then((res) => {
      if (Array.isArray(res.results)) {
        furnaceListRef.current = res.results;
      }
    });
  }, []);

  useEffect(() => {
    const onUpdate = (data: any) => {
      const selectedFurnace = data.selectedFurnace;
      const gatewayMac = getGatewayMac(selectedFurnace);

      if (!gatewayMac) {
        console.warn("Gateway MAC not found for furnace:", selectedFurnace);
        return;
      }

      const backendLock =
        data.lockStatus === true || data.lockStatus === "Locked";
      const previousLock = localStorage.getItem("lockStatus") === "true";

      console.log(
        `[GLOBAL XML] Lock status for ${selectedFurnace}:`,
        backendLock
      );
      localStorage.setItem("lockStatus", String(backendLock));

      if (mqttStatus === "enabled") {
        if (backendLock !== previousLock) {
          if (backendLock) {
            console.log(`[MQTT] Locking furnace ${selectedFurnace}`);
            dispatch(lockFurnaceThunk(gatewayMac));
          } else {
            console.log(`[MQTT] Unlocking furnace ${selectedFurnace}`);
            dispatch(unlockFurnaceThunk(gatewayMac));
          }
        }
      } else {
        dispatch(unlockFurnaceThunk(gatewayMac));
      }
    };

    const onError = (err: any) => {
      console.error("Global XML Comparison Error:", err?.message || err);
    };

    socket.on("comparisonUpdate", onUpdate);
    socket.on("comparisonError", onError);

    return () => {
      socket.off("comparisonUpdate", onUpdate);
      socket.off("comparisonError", onError);
    };
  }, [mqttStatus, dispatch]);
};
