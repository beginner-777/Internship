import React, { useState } from 'react';

export default function ValidatedForm({ onSubmit }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      setError('Field cannot be empty');
      return;
    }
    setError('');
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="validated-form">
      <label htmlFor="prompt-input">Enter Prompt</label>
      <input
        id="prompt-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {error && <span role="alert">{error}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}