import React from 'react';

export default function ChatMessage({ message, status = 'success', role = 'assistant' }) {
  return (
    <div aria-label={`chat-message-${role}`} className={`message ${status}`}>
      {status === 'pending' && <span role="status">Thinking...</span>}
      {status === 'streaming' && <span role="status">Streaming response...</span>}
      {status === 'error' && <span role="alert">Error generating response</span>}
      
      {status === 'success' && message && (
        <div className="message-content">
          {message.parts?.map((part, index) => {
            if (part.type === 'text') {
              return <p key={index}>{part.text}</p>;
            }
            if (part.type === 'code') {
              return <pre key={index} aria-label="code-snippet"><code>{part.code}</code></pre>;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}