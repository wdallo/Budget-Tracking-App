import React from "react";
// ///Usage example:
// import { SuccessAlert, ErrorAlert } from "../components/Alerts";
// {success && <SuccessAlert message="User updated successfully!" onClose={() => setSuccess(false)} />}
// {error && <ErrorAlert message={error} onClose={() => setError("")} />}

export const SuccessAlert = ({ message, onClose }) => (
  <div
    className="flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
    role="alert"
  >
    <span>{message}</span>
    {onClose && (
      <button
        onClick={onClose}
        className="ml-4 text-green-700 hover:text-green-900 font-bold"
        aria-label="Close"
      >
        &times;
      </button>
    )}
  </div>
);

export const ErrorAlert = ({ message, onClose }) => (
  <div
    className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    role="alert"
  >
    <span>{message}</span>
    {onClose && (
      <button
        onClick={onClose}
        className="ml-4 text-red-700 hover:text-red-900 font-bold"
        aria-label="Close"
      >
        &times;
      </button>
    )}
  </div>
);

export default { SuccessAlert, ErrorAlert };
