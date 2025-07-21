import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FinanceContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiCall = async (endpoint, options = {}) => {
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

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await apiCall("/transactions");
      // Sort by date descending (newest first)
      const sorted = data
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sorted);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!token) return;
    try {
      const data = await apiCall("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBudgets = async () => {
    if (!token) return;
    try {
      const data = await apiCall("/budgets");
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const deleteBudget = async (id) => {
    if (!token) return;
    try {
      await apiCall(`/budgets/${id}`, {
        method: "DELETE",
      });
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      await apiCall("/transactions", {
        method: "POST",
        body: JSON.stringify(transactionData),
      });
      await fetchTransactions();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      const data = await apiCall(`/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(transactionData),
      });
      setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await apiCall(`/transactions/${id}`, {
        method: "DELETE",
      });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const createCategory = async (categoryData) => {
    try {
      await apiCall("/categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
      });
      await fetchCategories();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const deleteCategory = async (id) => {
    if (!token) return { success: false, error: "No token provided" };
    try {
      await apiCall(`/categories/${id}`, {
        method: "DELETE",
      });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const createBudget = async (budgetData) => {
    try {
      const data = await apiCall("/budgets", {
        method: "POST",
        body: JSON.stringify(budgetData),
      });
      setBudgets((prev) => [...prev, data]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateBudget = async (id, budgetData) => {
    try {
      const data = await apiCall(`/budgets/${id}`, {
        method: "PUT",
        body: JSON.stringify(budgetData),
      });
      setBudgets((prev) => prev.map((b) => (b.id === id ? data : b)));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchCategories();
      fetchBudgets();
    }
  }, [token]);

  const value = {
    transactions,
    setTransactions, // Expose for optimistic UI
    categories,
    budgets,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createCategory,
    deleteCategory,
    setCategories, // Expose for optimistic UI
    createBudget,
    deleteBudget,
    updateBudget,
    setBudgets, // Expose for optimistic UI
    fetchTransactions,
    fetchCategories,
    fetchBudgets,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};
