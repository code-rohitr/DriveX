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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
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

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt here"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className={clsx(
              'px-4 py-2 rounded-lg',
              !input.trim() || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            )}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
