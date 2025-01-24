'use client';

import React, { useState, useEffect } from 'react';
import { ExcelService } from '../../services/excel';
import { GeminiService } from '../../services/gemini';
import { Chat } from './Chat';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasError) {
      console.error('An error occurred in the component tree.');
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

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
      const { content, data, columns, sheets } = await ExcelService.processExcel(file);

      // Update the document state
      setDocument({
        id: generateId(),
        name: file.name,
        content,
        type: file.type,
        data,
        columns,
        sheets
      });

      const summary = await GeminiService(
        content,
        "Provide a brief summary of this Excel file's contents. Include the number of sheets, total rows, and key information found in the data."
      );

      setMessages([{
        id: generateId(),
        content: summary.content,
        role: 'assistant',
        timestamp: new Date(),
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      console.error('File Processing Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!document) return;

    const newMessage = {
      id: generateId(),
      content,
      role: 'user',
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
        role: 'assistant',
        timestamp: new Date(),
        visualization: response.visualization
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process question');
      console.error('Question Processing Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {!document ? (
            <div className="max-w-xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Upload your Excel file</h2>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileProcess}
                className="border px-4 py-2 rounded-md cursor-pointer"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Current Document</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">File Name:</p>
                      <p className="text-gray-600">{document.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Sheets:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {document.sheets?.map((sheet) => (
                          <li key={sheet.name}>
                            {sheet.name} ({sheet.data.length} rows)
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Total Columns:</p>
                      <p className="text-gray-600">{document.columns.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
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
    </ErrorBoundary>
  );
}
