import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { marked } from 'marked';

// converting markdown to html for output
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
  // Static messages for the chat
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

  // State for user input, processing state, and message suggestions
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState(staticMessages);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate sending a message
  const onSendMessage = (message) => {
    setMessages([...messages, { id: messages.length + 1, role: 'user', content: message }]);
    setIsProcessing(true);

    // Simulate system response after a delay (fake API call)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, role: 'system', content: `This is a response to: "${message}"` },
      ]);
      setIsProcessing(false);
    }, 1000); // Simulating a 1-second processing time
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput('');
      setSuggestions([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx('flex flex-col', message.role === 'user' ? 'items-end' : 'items-start')}
          >
            <div
              className={clsx(
                'max-w-[80%] rounded-lg p-4',
                message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
              )}
            >
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }} />
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions Section */}
      <div className="p-4">
        {suggestions.length > 0 && (
          <div className="mb-4 space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        )}

        {/* Input and Send Button */}
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt here..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className={clsx(
              'px-4 py-2 rounded-lg',
              !input.trim() || isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
            )}
          >
            send
          </button>
        </form>
      </div>
    </div>
  );
}
