import { useEffect } from "react";
import socket from "@/services/socket";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { lockFurnaceThunk, unlockFurnaceThunk } from "@/features/mqtt";

export const useGlobalLockListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket.connected) socket.connect();

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
          dispatch(lockFurnaceThunk());
        } else {
          dispatch(unlockFurnaceThunk());
        }
      }
    };

    const handleError = (err: any) => {
      console.error("Global comparison error:", err.message || "Unknown error");
    };

    socket.on("comparisonUpdate", handleUpdate);
    socket.on("comparisonError", handleError);

    return () => {
      socket.off("comparisonUpdate", handleUpdate);
      socket.off("comparisonError", handleError);
    };
  }, []);
};
