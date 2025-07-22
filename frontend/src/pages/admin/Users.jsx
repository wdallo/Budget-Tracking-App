import React, { useState, useEffect } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import PopAlert from "../../components/PopAlert";
import { Search, Edit2, Trash2 } from "lucide-react";

const AdminUsers = () => {
  const { users, fetchUsers, setUsers, updateUser, deleteUser, loading } =
    useAdmin();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
    };
    const result = await updateUser(editingUser._id, userPayload);

    if (result.success) {
      setShowModal(false);
      setEditingUser(null);
      setFormData({ firstName: "", lastName: "", email: "", role: "user" });
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  const [popAlertOpen, setPopAlertOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setPopAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId) {
      const prevUsers = [...users];
      const newUsers = users.filter((u) => u._id !== pendingDeleteId);
      setUsers(newUsers);
      setPopAlertOpen(false);
      try {
        await deleteUser(pendingDeleteId);
      } catch {
        setUsers(prevUsers);
        alert("Failed to delete user. Please refresh.");
      }
      setPendingDeleteId(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName &&
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName &&
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  useEffect(() => {
    fetchUsers();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Users
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage application users and roles
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <li className="px-4 py-6 text-center text-gray-500">
              No users found.
            </li>
          ) : (
            filteredUsers.map((user) => (
              <li key={user._id} className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}{" "}
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
                          admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                          {user.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
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

      <PopAlert
        open={popAlertOpen}
        onCancel={() => {
          setPopAlertOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {showModal && (
        <div
          style={{ marginTop: "-120px" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit User
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ...form fields... */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      role: "user",
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
