import React from 'react'

function FileUpload() {
  return (
    <div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        File Upload and User Prompt
      </h1>

      <div className="mb-4">
        <input
          type="file"
          className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
      </div>


        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold text-lg mb-3">File Details:</h3>
          <ul className="space-y-2">
            <li><strong>Name:</strong> Name </li>
            <li><strong>Size:</strong> File Size </li>
            <li><strong>Type:</strong> Type </li>
          </ul>
        </div>
      


        <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold text-lg mb-3">File has been uploaded successsfully.</h3>
          {/* <pre className="text-gray-800 w-full text-wrap">{excelData}</pre> */}
        </div>
      

      <div className="mb-4">
        <label htmlFor="prompt" className="block text-lg font-semibold text-gray-700">
          Enter your prompt:
        </label>
        <input
          type="text"
          id="prompt"
          placeholder="Type something..."
          className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
      > Submit
      </button>


        <div className="mt-6 p-4 bg-gray-50 border rounded-lg shadow-md">
          <h3 className="font-semibold text-xl mb-2">Response:</h3>
          <pre className="text-gray-800 w-full text-wrap">sample response</pre>
        </div>
      

    </div>
  )
}

export default FileUpload