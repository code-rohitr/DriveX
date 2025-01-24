import React from 'react';
import { clsx } from 'clsx';
import { marked } from 'marked';

// Helper function to safely parse markdown
const parseMarkdown = (content) => {
  if (!content) return '';
  try {
    return marked(content);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return String(content);
  }
};

export function Chat() {
  const staticMessages = [
    {
      id: 1,
      role: 'user',
      content: 'this is a sample question',
    },
    {
      id: 2,
      role: 'system',
      content: 'sample answer 1',
    },
    {
      id: 3,
      role: 'user',
      content: 'sample question 2 from the used side',
    },
    {
      id: 4,
      role: 'system',
      content: 'sample answer 2 from the system',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {staticMessages.map((message) => (
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
                  __html: parseMarkdown(String(message.content)) 
                }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <form className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter your prompt here..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

          />
          <button
            type="submit"

            className="px-4 py-2 rounded-lg bg-gray-300 cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
