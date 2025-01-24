"use client";

import React, { useState, useEffect } from "react";
import { ExcelService } from "../../services/excel";
import { GeminiService } from "../../services/gemini";
import { Chat } from "./Chat";
import { motion } from "framer-motion";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasError) {
      console.error("An error occurred in the component tree.");
    }
  }, [hasError]);

  const handleError = () => setHasError(true);

  if (hasError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p>Please try refreshing the page or uploading a different file.</p>
      </div>
    );
  }

  return <>{children}</>;
};

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function Gemini() {
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  // const geminiService = new GeminiService();

  // Handle file upload and processing
  const handleFileProcess = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);

      // Process the Excel file
      const { content, data, columns, sheets } =
        await ExcelService.processExcel(file);

      // Update the document state
      setDocument({
        id: generateId(),
        name: file.name,
        content,
        type: file.type,
        data,
        columns,
        sheets,
      });

      const summary = await GeminiService(
        content,
        "Provide a brief summary of this Excel file's contents. Include the number of sheets, total rows, and key information found in the data."
      );

      setMessages([
        {
          id: generateId(),
          content: summary.content,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
      console.error("File Processing Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!document) return;

    const newMessage = {
      id: generateId(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(true);
    setError(null);

    try {
      const response = await GeminiService(document.content, content);

      const aiResponse = {
        id: generateId(),
        content: response.content,
        role: "assistant",
        timestamp: new Date(),
        visualization: response.visualization,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process question"
      );
      console.error("Question Processing Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900">
      <div className="h-[85vh] w-9/12 mx-auto bg-slate-900">
        <main className="w-full h-full mx-auto px-4 py-8">
          {!document ? (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl mx-auto"
            >
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileProcess}
                className="hidden"
                id="file-upload"
              />

              <label
                htmlFor="file-upload"
                className="bg-slate-700 text-white font-semibold p-10 text-base rounded max-w-72 h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] hover:border-blue-500 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 mb-2 fill-white hover:fill-blue-500 transition duration-300"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                    data-original="#000000"
                  />
                  <path
                    d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                    data-original="#000000"
                  />
                </svg>
                Upload file
                <p className="text-xs font-medium text-gray-200 mt-2">
                  Only .xlsx or .xls files are allowed.
                </p>
              </label>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 h-full">
              <div className="lg:col-span-1 w-3/3">
                <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
                className="bg-slate-800 p-6 rounded-lg shadow text-white">
                  <h2 className="text-lg font-semibold mb-4">
                    Current Document
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">File Name:</p>
                      <p className="text-slate-300">{document.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Sheets:</p>
                      <ul className="list-disc list-inside text-slate-300">
                        {document.sheets?.map((sheet) => (
                          <li key={sheet.name}>
                            {sheet.name} ({sheet.data.length} rows)
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Total Columns:</p>
                      <p className="text-slate-300">
                        {document.columns.length}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* message sent by the user */}
              <div className="lg:col-span-5 max-h-full">
                <div className="bg-slate-900 h-[80vh] max-h-full  overflow-scroll rounded-lg shadow">
                  <Chat
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isProcessing={isProcessing}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
