// hooks/socket/useGlobalLockListener.ts
import { useEffect } from "react";
import socket from "@/services/socket";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { lockFurnaceThunk, unlockFurnaceThunk } from "@/features/mqtt";

export const useGlobalLockListener = (gatewayMac: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!gatewayMac) return;

    const furnaceId = localStorage.getItem("selectedFurnace");
    if (!furnaceId) {
      console.warn("Furnace ID is required but not found in localStorage.");
      return;
    }

    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      socket.emit("selectFurnace", furnaceId);
    };

    const handleUpdate = (data: any) => {
      const mqttStatus =
        (localStorage.getItem("mqttStatus") as "enabled" | "disabled") ||
        "enabled";

      const isLocked = data?.comparisonResults?.some(
        (item: any) => !item.inTolerance
      );

      const previousStatus = localStorage.getItem("lockStatus") === "true";
      localStorage.setItem("lockStatus", String(isLocked));

      if (mqttStatus === "enabled" && isLocked !== previousStatus) {
        if (isLocked) {
          dispatch(lockFurnaceThunk(gatewayMac));
        } else {
          dispatch(unlockFurnaceThunk(gatewayMac));
        }
      }
    };

    const handleError = (err: any) => {
      console.error(
        "Global comparison error:",
        err?.message || "Unknown error"
      );
    };

    socket.on("connect", handleConnect);
    socket.on("comparisonUpdate", handleUpdate);
    socket.on("comparisonError", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("comparisonUpdate", handleUpdate);
      socket.off("comparisonError", handleError);
    };
  }, [dispatch, gatewayMac]);
};
