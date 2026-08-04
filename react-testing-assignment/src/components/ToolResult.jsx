import React from 'react';

export default function ToolResult({ toolName, result, status }) {
  return (
    <div aria-label={`tool-result-${toolName}`}>
      <h4>Tool: {toolName}</h4>
      {status === 'loading' && <p role="status">Executing tool...</p>}
      {status === 'error' && <span role="alert">Tool execution failed</span>}
      {status === 'success' && (
        <div aria-label="output-data">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}