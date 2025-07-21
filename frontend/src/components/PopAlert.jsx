import React from "react";

function PopAlert({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmText = "OK",
  cancelText = "Cancel",
}) {
  if (!open) return null;
  return (
    <div
      style={{ marginTop: "-50px" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <div className="mb-4 text-gray-600">{description}</div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopAlert;
