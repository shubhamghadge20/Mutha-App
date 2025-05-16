import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { RegisterForm, LoginForm, setAuthFromStorage } from "@features/auth";
import { useAppDispatch } from "@/hooks/reduxHooks";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ProtectedRoute from "@components/ProtectedRoute";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import PageNotFound from "@components/PageNotFound";
import Layout from "@components/Layout";
import { useAuth } from "@/hooks/auth/useAuth";
import Products from "./pages/Products";
import XmlCompare from "./components/Xml/XmlMaster";

function App() {
  const dispatch = useAppDispatch();
  const { checkTokenExpiration, tryRefreshToken } = useAuth();

  useEffect(() => {
    dispatch(setAuthFromStorage());

    // Check token and refresh if needed
    if (!checkTokenExpiration()) {
      tryRefreshToken();
    }
  }, [dispatch]);

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
          path="/xmlcompare"
          element={
            <ProtectedRoute>
              <Layout>
                <XmlCompare />
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
