import React, { useState } from "react";
import PopAlert from "../components/PopAlert";
import { useFinance } from "../contexts/FinanceContext";
import { Plus, Tag, Trash2 } from "lucide-react";

const Categories = () => {
  const { categories, setCategories, createCategory, deleteCategory, loading } =
    useFinance();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
    icon: "tag",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await createCategory(formData);

    if (result.success) {
      setShowModal(false);
      setFormData({
        name: "",
        color: "#3B82F6",
        icon: "tag",
      });
    }
  };

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#F97316",
    "#06B6D4",
    "#84CC16",
    "#EC4899",
    "#6B7280",
  ];
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
      const prevCategory = [...categories];
      setOptimisticPrev(prevCategory);
      const newCategory = categories.filter(
        (cat) => cat._id !== pendingDeleteId
      );
      setCategories(newCategory);
      setPopAlertOpen(false);
      try {
        await deleteCategory(pendingDeleteId);
      } catch {
        setCategories(prevCategory);
        alert("Failed to delete category. Please refresh.");
      }
      setPendingDeleteId(null);
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
            Categories
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your transactions with custom categories
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div
                  className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  <Tag className="h-5 w-5" style={{ color: category.color }} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {category.name}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No categories
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first category.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Add Category
            </button>
          </div>
        </div>
      )}
      {/* PopAlert for Delete Confirmation */}
      <PopAlert
        open={popAlertOpen}
        onCancel={() => {
          setPopAlertOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this Category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
      {/* Modal */}
      {showModal && (
        <div
          style={{ marginTop: "-50px" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New Category
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color
                          ? "border-gray-900"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      name: "",
                      color: "#3B82F6",
                      icon: "tag",
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

export default Categories;
