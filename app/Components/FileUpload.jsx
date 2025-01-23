"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

function FileUpload() {
  const [fileDetails, setFileDetails] = useState(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState('');
  const [fileSelected, setFileSelected] = useState(false);

  // Handle file change and parse the Excel file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileDetails({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setFileSelected(true);
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
  
        //the first sheet in excel file should be the first one
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
  
        // storing output for api
        setExcelData(JSON.stringify(jsonData, null, 2));
      };
  
      reader.readAsArrayBuffer(file); // =
    }
  };

  const handlePromptChange = (e) => {
    setUserPrompt(e.target.value);
  };

  //handling the submit for api
  async function handleSubmit() {
    setLoading(true);
    if (!excelData || !userPrompt) return;

    setLoading(true);

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileDetails,
          excelData, // Sending the extracted data from the Excel file
          userPrompt,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.reply);
      } else {
        setResponse('Error: ' + data.error);
      }
    } catch (error) {
      setResponse('An error occurred while communicating with OpenAI.');
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen w-1/2 mx-auto">
      <div className="flex items-center justify-center flex-col mt-10">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          File Upload and User Prompt
        </h1>
        <p>Upload your file and proceed to chat.</p>
      </div>

      <div className="flex-1 overflow-auto px-4 py-6">
        {/* Show Choose File button or the rest of the components */}
        {!fileSelected ? (
          <div className="flex justify-center items-center h-48 border-4 border-dashed border-gray-300 rounded-lg">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="text-xl text-gray-500 cursor-pointer"
            >
              Choose File
            </label>
          </div>
        ) : (
          <>
            {/* File details */}
            <div className="mb-4">
              <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
                <h3 className="font-semibold text-lg mb-3">File Details:</h3>
                <ul className="space-y-2">
                  <li>
                    <strong>Name:</strong> {fileDetails.name}
                  </li>
                  <li>
                    <strong>Size:</strong> {fileDetails.size}
                  </li>
                  <li>
                    <strong>Type:</strong> {fileDetails.type}
                  </li>
                </ul>
              </div>

              {/* Success message */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-6">
                <h3 className="font-semibold text-lg mb-3">
                  File has been uploaded successfully.
                </h3>
              </div>

              {/* Response Section */}
              <div className="mt-6 p-4 bg-gray-50 border rounded-lg shadow-md">
                <h3 className="font-semibold text-xl mb-2">Response:</h3>
                <pre className="text-gray-800 w-full text-wrap">{response}</pre>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Prompt input and Submit button fixed at the bottom (only shown after file is uploaded) */}
      {fileSelected && (
        <div className="fixed bottom-0 left-[50%] translate-x-[-50%] w-1/2 bg-gray-50 p-4 border-t rounded-lg shadow-md">
          <div className="mb-4">
            <label
              htmlFor="prompt"
              className="block text-lg font-semibold text-gray-700"
            >
              Enter your prompt:
            </label>
            <input
              type="text"
              id="prompt"
              value={userPrompt}
              onChange={handlePromptChange}
              placeholder="Type something..."
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
