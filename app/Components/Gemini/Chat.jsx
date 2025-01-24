import React, { useState } from 'react';
import { clsx } from 'clsx';
import { marked } from 'marked';

const parseMarkdown = (content) => {
  if (!content) return '';
  try {
    return marked(content);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return String(content);
  }
};

export function Chat({ messages, onSendMessage, isProcessing }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto ">
      <div className="flex-1 overflow-y-auto pb-4 h-full overflow-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx(
              'flex flex-col',
              message.role === 'user' ? 'items-end' : 'items-start'
            )}
          >
            <div
              className={clsx(
                'max-w-[80%] rounded-lg p-4',
                message.role === 'user'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-900 text-white'
              )}
            >
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(String(message.content)),
                }}
              />
            </div>
            {message.visualization && (
              <div className="w-full mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  {message.visualization.title}
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt here"
            className="w-full p-3 rounded-r-none border border-slate-500 border-r-0 text-white outline-none bg-slate-600 rounded-md shadow-sm focus:ring-2 focus:border-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="w-auto py-3 px-5 bg-blue-500 transition-colors text-white rounded-l-none border border-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
