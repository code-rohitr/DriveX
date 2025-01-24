"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {FaGithub, FaLinkedin} from 'react-icons/fa'
import Link from "next/link";

function Header({ onModelChange }) {
  const [selectedModel, setSelectedModel] = useState("Gemini");

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    onModelChange(event.target.value);
  };

  return (
    <motion.div className="bg-slate-900 text-white">
      <motion.div
      initial={{y: -50, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.5}}
        className={`w-9/12 mx-auto flex items-center justify-between h-[15vh] max-sm:h-[25vh]`}
      >
        <div className="flex justify-between items-center w-full max-sm:flex-col">
          <div className="max-sm: mb-5">
            <h1 className="text-3xl font-bold text-center">
              File Upload and User Prompt
            </h1>
            <p className="text-slate-300 max-sm:text-center">Upload your file and proceed to chat.</p>
          </div>

          <div className="flex justify-center items-center space-x-10">
          <Link href={"https://www.linkedin.com/in/rohit-raj-3abb13201/"} target="_blank" className="text-3xl">
            <FaLinkedin/>
          </Link>
          <Link href={"https://github.com/code-rohitr"} target="_blank" className="text-3xl">
            <FaGithub/>
          </Link>
            <select
              value={selectedModel}
              onChange={handleModelChange}
              className="p-2 px-10 rounded-md border bg-blue-600 border-blue-500 text-white  outline-none cursor-pointer"
            >
              <option value="Gemini">Gemini</option>
              <option value="GPT-4">GPT-4</option>
            </select>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Header;
