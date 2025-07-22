import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FinanceProvider } from "./contexts/FinanceContext";

import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AccessDenied from "./pages/admin/AccessDenied";
import { AdminProvider } from "./contexts/AdminContext";
import AdminUsers from "./pages/admin/Users";

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Transactions />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Categories />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budgets"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Budgets />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/*Admin routes */}

              <Route path="/access-denied" element={<AccessDenied />} />

              <Route
                path="/admin/dashboard"
                element={
                  <AdminProvider>
                    <AdminProtectedRoute>
                      <Layout>
                        <AdminDashboard />
                      </Layout>
                    </AdminProtectedRoute>
                  </AdminProvider>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProvider>
                    <AdminProtectedRoute>
                      <Layout>
                        <AdminUsers />
                      </Layout>
                    </AdminProtectedRoute>
                  </AdminProvider>
                }
              />

              {/* Error Handling */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
