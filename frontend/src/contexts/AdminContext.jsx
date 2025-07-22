import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const AdminContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { token, user } = useAuth(); // Assume user object has a 'role' property
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";
  const admin = user;
  const apiCall = async (endpoint, options = {}) => {
    if (!isAdmin) throw new Error("Not authorized");
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  };

  const fetchUsers = async () => {
    if (!token || !isAdmin) return;
    try {
      setLoading(true);
      const data = await apiCall("/auth/admin/users");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCount = async () => {
    if (!token || !isAdmin) return null;
    try {
      const response = await apiCall("/auth/admin/users/count");
      // Assuming response is { count: number }
      return response.count;
    } catch (error) {
      console.error("Failed to fetch user count:", error);
      return null;
    }
  };

  const createUser = async (userData) => {
    if (!isAdmin) return { success: false, error: "Not authorized" };
    try {
      await apiCall("/auth/admin/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      await fetchUsers();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (id, userData) => {
    if (!isAdmin) return { success: false, error: "Not authorized" };
    try {
      const data = await apiCall(`/auth/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
      setUsers((prev) => prev.map((u) => (u.id === id ? data : u)));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (id) => {
    if (!isAdmin) return { success: false, error: "Not authorized" };
    try {
      await apiCall(`/auth/admin/users/${id}`, {
        method: "DELETE",
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const banUser = async (id) => {
    if (!isAdmin) return { success: false, error: "Not authorized" };
    try {
      await apiCall(`/auth/admin/users/ban/${id}`, {
        method: "PUT",
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, banned: true } : u))
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const value = {
    users,
    setUsers,
    loading,
    fetchUsers,
    fetchUserCount,
    createUser,
    updateUser,
    deleteUser,
    banUser,
    isAdmin,
    admin,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
