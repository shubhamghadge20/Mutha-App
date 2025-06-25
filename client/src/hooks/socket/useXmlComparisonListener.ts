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
      const gatewayMac = furnaceListRef.current.find(
        (f) => f.furnaceId === selectedFurnace
      )?.gatewayMac;

      if (!gatewayMac) return;

      const backendLock =
        data.lockStatus === true || data.lockStatus === "Locked";
      const previousLock = localStorage.getItem("lockStatus") === "true";

      localStorage.setItem("lockStatus", String(backendLock));

      if (mqttStatus === "enabled") {
        if (backendLock !== previousLock) {
          if (backendLock) {
            dispatch(lockFurnaceThunk(gatewayMac));
          } else {
            dispatch(unlockFurnaceThunk(gatewayMac));
          }
        }
      } else {
        dispatch(unlockFurnaceThunk(gatewayMac));
      }
    };

    const onError = (err: any) => {
      console.error(" Global comparison error:", err?.message || err);
    };

    socket.on("comparisonUpdate", onUpdate);
    socket.on("comparisonError", onError);

    return () => {
      socket.off("comparisonUpdate", onUpdate);
      socket.off("comparisonError", onError);
    };
  }, [mqttStatus, dispatch]);
};
