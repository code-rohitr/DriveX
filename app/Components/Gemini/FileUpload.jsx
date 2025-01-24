import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { clsx } from "clsx";

export function FileUpload({ onFileProcess }) {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        onFileProcess(file);
      }
    },
    [onFileProcess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400"
      )}
    >
      <input {...getInputProps()} />
      Upload
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Drop the file here..."
          : "Drag 'n' drop an Excel file here, or click to select"}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supports .xlsx and .xls files
      </p>
    </div>
  );
}
