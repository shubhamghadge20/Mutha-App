import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { RegisterForm, LoginForm, setAuthFromStorage } from "@features/auth";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useAuth } from "@/hooks/auth/useAuth";

import { useGlobalXmlComparisonListener } from "@/hooks/socket/useXmlComparisonListener";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import XmlPage from "./pages/Xml";
import XmlHistoryPage from "./pages/XmlHisory";

import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Layout from "@components/Layout";
import ProtectedRoute from "@components/ProtectedRoute";
import PageNotFound from "@components/PageNotFound";
import FurnaceGatewayPage from "./pages/FurnaceGateway";

function App() {
  const dispatch = useAppDispatch();
  const authChecked = useAppSelector((state) => state.auth.authChecked);
  const { checkTokenExpiration, tryRefreshToken } = useAuth();

  // ✅ Connect the socket only once when App mounts

  // 🔊 Passive listener (does not connect socket)

  useGlobalXmlComparisonListener();

  // 🔐 Auth load
  useEffect(() => {
    dispatch(setAuthFromStorage());
    if (!checkTokenExpiration()) tryRefreshToken();
  }, [dispatch]);

  if (!authChecked)
    return <div className="p-6 text-center">Checking authentication...</div>;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/register"
          element={
            <Layout>
              <RegisterForm />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginForm />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product"
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/xml"
          element={
            <ProtectedRoute>
              <Layout>
                <XmlPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <XmlHistoryPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/furnace-gateway"
          element={
            <ProtectedRoute>
              <Layout>
                <FurnaceGatewayPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
