import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
    <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
    <p className="text-lg text-gray-700 mb-6">
      You do not have permission to view this page.
    </p>
    <Link
      to="/"
      className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
    >
      Go to Home
    </Link>
  </div>
);

export default AccessDenied;
