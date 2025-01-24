"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";

function FileUpload() {
  const [fileDetails, setFileDetails] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState("");
  const [fileSelected, setFileSelected] = useState(false);

  useEffect(() => {
    if (fileDetails) {
      toast("File Uploaded Successfully");
    }
  }, [fileDetails]);

  // Handle file change and parse the Excel file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
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

        // The first sheet in excel file should be the first one
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Storing output for API
        setExcelData(JSON.stringify(jsonData, null, 2));
      };

      reader.readAsArrayBuffer(file); // Read file
    } else {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
    }
  };

  const handlePromptChange = (e) => {
    setUserPrompt(e.target.value);
  };

  // Handling the submit for API
  async function handleSubmit() {
    setLoading(true);
    if (!excelData || !userPrompt) return;

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        setResponse("Error: " + data.error);
      }
    } catch (error) {
      setResponse("An error occurred while communicating with OpenAI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900">
      <div className="flex flex-col w-9/12 mx-auto h-[85vh] pb-[10vh] overflow-hidden bg-slate-900">
        <div className="flex-1 overflow-auto px-0  bg-slate-900 h-auto rounded-md max-h-full dark:bg-slate-900">
          {/* Show Choose File button or the rest of the components */}
          {!fileSelected ? (
            <div className="flex justify-center items-start h-full w-full">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-slate-700 text-white font-semibold p-10 text-base rounded max-w-6/12 h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] hover:border-blue-500 transition duration-300"
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
            </div>
          ) : (
            <>
              {/* File details */}
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="py-4 px-4 rounded-lg bg-slate-800 h-24">
                  <ul className="space-y-2 flex-col justify-start items-start text-white">
                    <li>
                      <strong>Name:</strong> {fileDetails.name}
                    </li>
                    <li>
                      <strong>Size:</strong> {fileDetails.size} Bytes
                    </li>
                  </ul>
                </div>

                {/* Response Section */}
                <div className="p-4 col-span-5 bg-slate-800 rounded-lg dark:bg-slate-800 text-white">
                  <h3 className="font-semibold text-xl mb-2 text-green-400">Response:</h3>
                  <pre className="text-white w-full text-wrap">
                    {response}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Prompt input and Submit button fixed at the bottom (only shown after file is uploaded) */}
        {fileSelected && (
          <div className="fixed bottom-0 left-[50%] translate-x-[-50%] w-9/12 py-4 rounded-lg flex justify-center items-center">
            <div className=" w-full ">
              <input
                type="text"
                id="prompt"
                value={userPrompt}
                onChange={handlePromptChange}
                placeholder="Enter your prompt here"
                className="w-full p-3 rounded-r-none border border-slate-500 border-r-0 text-white outline-none bg-slate-600 rounded-md shadow-sm focus:ring-2 focus:border-blue-500"
              />
            </div>

            <button
              className="w-auto py-3 px-5 bg-blue-500 transition-colors text-white rounded-l-none border border-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Send"}
            </button>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default FileUpload;
