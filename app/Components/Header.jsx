"use client";

import React, { useState } from "react";

function Header({ onModelChange }) {
  const [selectedModel, setSelectedModel] = useState("GPT-4");

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    onModelChange(event.target.value); 
  };

  return (
    <div className="bg-white border dark:bg-slate-900">
      <div className={`w-6/12 mx-auto flex items-center justify-between h-[10vh]`}>
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-3xl font-bold text-center">
              File Upload and User Prompt
            </h1>
            <p>Upload your file and proceed to chat.</p>
          </div>

          <div>
            <select
              value={selectedModel}
              onChange={handleModelChange}
              className="p-2 px-10 rounded-md border border-gray-300 text-gray-700"
            >
              <option value="GPT-4">GPT-4</option>
              <option value="Gemini">Gemini</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
