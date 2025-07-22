import React from "react";
import { Link } from "react-router-dom";

const BannedPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-gray-50 to-red-50 px-4">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
      <h1 className="text-5xl font-extrabold text-red-700 mb-4 drop-shadow-lg">
        Banned User
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Your account has been{" "}
        <span className="font-semibold text-red-600">banned</span>. If you
        believe this is a mistake, please contact our support team.
      </p>
      <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
        <div className="text-md text-gray-800">
          <strong>Support Email:</strong>{" "}
          <a href="mailto:support@mockdomain.com" className="text-red-600">
            support@mockdomain.com
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a href="tel:5551234567" className="text-red-600">
            (555) 123-4567
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default BannedPage;
