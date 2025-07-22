import React, { useState } from "react";
import PopAlert from "../components/PopAlert";
import { useFinance } from "../contexts/FinanceContext";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { SuccessAlert, ErrorAlert } from "../components/Alerts";

const Transactions = () => {
  const {
    transactions,
    fetchTransactions,
    setTransactions,
    categories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
  } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map form fields to backend model fields
    const transactionPayload = {
      category: formData.category_id,
      amount: Number(formData.amount),
      date: formData.date,
      type: formData.type,
      description: formData.description,
    };

    const result = editingTransaction
      ? await updateTransaction(editingTransaction._id, transactionPayload)
      : await createTransaction(transactionPayload);

    if (result.success) {
      setShowModal(false);
      setEditingTransaction(null);
      setFormData({
        amount: "",
        description: "",
        category_id: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
      });
      setSuccess(editingTransaction ? "update" : "create");
      setError("");
      fetchTransactions();
    } else {
      setError(result.error || "Failed to save transaction.");
      setSuccess(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      description: transaction.description,
      category_id: transaction.category_id,
      date: transaction.date
        ? new Date(transaction.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      type: transaction.type,
    });

    setShowModal(true);
  };

  // PopAlert state for delete confirmation
  const [popAlertOpen, setPopAlertOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [optimisticPrev, setOptimisticPrev] = useState(null);

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setPopAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId) {
      // Optimistically remove from UI
      const prevTransactions = [...transactions];
      setOptimisticPrev(prevTransactions);
      const newTransactions = transactions.filter(
        (t) => t._id !== pendingDeleteId
      );
      setTransactions(newTransactions);
      setPopAlertOpen(false);
      try {
        const result = await deleteTransaction(pendingDeleteId);
        if (result && result.success) {
          setDeleteSuccess(true);
          setDeleteError("");
        } else {
          setTransactions(prevTransactions);
          setDeleteError(
            result?.error || "Failed to delete transaction. Please refresh."
          );
          setDeleteSuccess(false);
        }
      } catch {
        setTransactions(prevTransactions);
        setDeleteError("Failed to delete transaction. Please refresh.");
        setDeleteSuccess(false);
      }
      setPendingDeleteId(null);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success === "create" && (
        <SuccessAlert
          message="Transaction created successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
      {success === "update" && (
        <SuccessAlert
          message="Transaction updated successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      {deleteSuccess && (
        <SuccessAlert
          message="Transaction deleted successfully!"
          onClose={() => setDeleteSuccess(false)}
        />
      )}
      {deleteError && (
        <ErrorAlert message={deleteError} onClose={() => setDeleteError("")} />
      )}
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your income and expenses
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTransactions.length === 0 ? (
            <li className="px-4 py-6 text-center text-gray-500">
              No transactions found. Create your first transaction to get
              started!
            </li>
          ) : (
            filteredTransactions.map((transaction) => (
              <li key={transaction._id} className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          transaction.type === "income"
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.category?.name || "Uncategorized"} •{" "}
                        {format(new Date(transaction.date), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`text-sm font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {parseFloat(transaction.amount).toFixed(2)}&euro;
                    </div>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* PopAlert for Delete Confirmation */}
      <PopAlert
        open={popAlertOpen}
        onCancel={() => {
          setPopAlertOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Modal */}
      {showModal && (
        <div
          style={{ marginTop: "-120px" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
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
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
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
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
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
                    setEditingTransaction(null);
                    setFormData({
                      amount: "",
                      description: "",
                      category_id: "",
                      date: new Date().toISOString().split("T")[0],
                      type: "expense",
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
                  {editingTransaction ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
