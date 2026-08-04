import { render, screen } from '@testing-library/react';
import ChatMessage from './ChatMessage';

describe('ChatMessage Component', () => {
  it('renders pending state correctly', () => {
    render(<ChatMessage status="pending" />);
    expect(screen.getByRole('status')).toHaveTextContent('Thinking...');
  });

  it('renders streaming state correctly', () => {
    render(<ChatMessage status="streaming" />);
    expect(screen.getByRole('status')).toHaveTextContent('Streaming response...');
  });

  it('renders error state correctly', () => {
    render(<ChatMessage status="error" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error generating response');
  });

  it('renders text and code part types correctly', () => {
    const messageData = {
      parts: [
        { type: 'text', text: 'Hello, here is your code:' },
        { type: 'code', code: 'const x = 10;' }
      ]
    };
    render(<ChatMessage message={messageData} status="success" />);
    
    expect(screen.getByText('Hello, here is your code:')).toBeInTheDocument();
    expect(screen.getByLabelText('code-snippet')).toHaveTextContent('const x = 10;');
  });
});