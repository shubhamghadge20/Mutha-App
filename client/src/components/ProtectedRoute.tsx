import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store";

interface Props {
  children: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
