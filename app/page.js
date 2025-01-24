"use client"

import React, { useState } from "react";
import Header from "./Components/Header";
import FileUpload from "./Components/FileUpload";
import Gemini from "./Components/Gemini/Gemini";


export default function Home() {
  const [selectedModel, setSelectedModel] = useState("Gemini");

  // Function to handle model change
  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  return (
    <div className="dark:bg-slate-900">
      <Header onModelChange={handleModelChange} />

      <div className="">
        {selectedModel === "Gemini" && <Gemini />}
        {selectedModel === "GPT-4" && <FileUpload />}
      </div>

      {/* Render FileUpload component */}
      {/* <FileUpload /> */}
    </div>
  );
}
