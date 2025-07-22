import React, { useContext, useEffect, useState } from "react";
import { Users, FileText, Settings, TrendingUp, Plus } from "lucide-react";
import { useAdmin } from "../../contexts/AdminContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { users, isAdmin, admin, fetchUserCount } = useAdmin();
  const [userCount, setUserCount] = useState(null);
  useEffect(() => {
    const getCount = async () => {
      const count = await fetchUserCount();
      setUserCount(count);
    };
    getCount();
  }, [fetchUserCount]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome, {admin?.firstName + " " + admin?.lastName || "Admin"}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users, view reports, and configure settings.
          </p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Users</div>
              <div className="text-lg font-semibold text-gray-900">
                {userCount !== null ? userCount : "Loading..."}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <FileText className="h-8 w-8 text-green-500" />
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Reports</div>
              <div className="text-lg font-semibold text-gray-900">12</div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Active</div>
              <div className="text-lg font-semibold text-gray-900">6</div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <Settings className="h-8 w-8 text-gray-500" />
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Settings</div>
              <div className="text-lg font-semibold text-gray-900">
                Configured
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Common admin tasks
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/admin/users"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border hover:shadow-md transition-shadow"
            >
              <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                <Users className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Manage Users
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add, edit, or remove users
                </p>
              </div>
            </Link>
            <Link
              to="/admin/reports"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border hover:shadow-md transition-shadow"
            >
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                <FileText className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  View Reports
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Access system analytics
                </p>
              </div>
            </Link>
            <Link
              to="/admin/settings"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500 rounded-lg border hover:shadow-md transition-shadow"
            >
              <span className="rounded-lg inline-flex p-3 bg-gray-50 text-gray-600 ring-4 ring-white">
                <Settings className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Configure Settings
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Update admin preferences
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
