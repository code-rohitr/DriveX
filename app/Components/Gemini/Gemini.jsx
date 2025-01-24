'use client';

import React, { useState, useEffect } from 'react';

import { Chat } from '../Gemini/Chat';


const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function Gemini() {
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Handle file upload and processing
  const handleFileProcess = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);

      setDocument({
        id: generateId(),
        name: file.name,
        type: file.type,

      });


      setMessages([{
        id: generateId(),
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

    
  };

  return (
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
  );
}
