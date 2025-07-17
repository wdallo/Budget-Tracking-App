import React, { useState } from "react";
import { useFinance } from "../contexts/FinanceContext";
import { Plus, Target, AlertCircle } from "lucide-react";
import { format, isAfter, isBefore, parseISO } from "date-fns";

const Budgets = () => {
  const { budgets, categories, createBudget, loading, transactions } =
    useFinance();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    period: "monthly",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map form fields to backend model fields
    const selectedCategory = categories.find(
      (c) => c._id === formData.category_id
    );
    const budgetPayload = {
      category: formData.category_id,
      name: selectedCategory ? selectedCategory.name : "",
      amount: Number(formData.amount),
      startDate: formData.start_date,
      endDate: formData.end_date,
    };

    const result = await createBudget(budgetPayload);

    if (result.success) {
      setShowModal(false);
      setFormData({
        category_id: "",
        amount: "",
        period: "monthly",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Budgets
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Set spending limits and track your budget goals
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Create Budget
          </button>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          // Calculate total spent for this budget's category and date range
          const start = parseISO(budget.startDate);
          const end = parseISO(budget.endDate);
          const spent = transactions
            ? transactions
                .filter((t) => {
                  if (t.type !== "expense") return false;
                  // Robust category match: string or object
                  const catId =
                    t.category && typeof t.category === "object"
                      ? t.category._id
                      : t.category;
                  return (
                    String(catId) === String(budget.category) &&
                    !isBefore(parseISO(t.date), start) &&
                    !isAfter(parseISO(t.date), end)
                  );
                })
                .reduce((sum, t) => sum + Number(t.amount), 0)
            : 0;
          const progress =
            budget.amount > 0
              ? Math.min((spent / budget.amount) * 100, 100)
              : 0;
          return (
            <div
              key={budget._id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: budget.categories?.color + "20",
                      }}
                    >
                      <Target
                        className="h-5 w-5"
                        style={{ color: budget.categories?.color }}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {budget.categories?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {budget.period}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${parseFloat(budget.amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-bold text-blue-700">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 transition-all duration-700 ease-in-out flex items-center"
                      style={{
                        width: `${progress}%`,
                        minWidth: progress > 0 ? "2rem" : 0,
                      }}
                    >
                      {progress > 10 && (
                        <span className="ml-3 text-xs font-bold text-white drop-shadow-sm">
                          {Math.round(progress)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      Spent:{" "}
                      <span className="font-semibold text-gray-700">
                        ${spent.toFixed(2)}
                      </span>
                    </span>
                    <span>
                      Budget:{" "}
                      <span className="font-semibold text-gray-700">
                        ${parseFloat(budget.amount).toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  {format(new Date(budget.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(budget.endDate), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No budgets</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first budget.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Create Budget
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Budget
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <select
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      category_id: "",
                      amount: "",
                      period: "monthly",
                      start_date: new Date().toISOString().split("T")[0],
                      end_date: "",
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
