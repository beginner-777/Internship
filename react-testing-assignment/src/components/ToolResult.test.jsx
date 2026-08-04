import { render, screen } from '@testing-library/react';
import ToolResult from './ToolResult';

describe('ToolResult Component', () => {
  it('renders tool success state and output data', () => {
    render(<ToolResult toolName="WebSearch" result="Found 5 results" status="success" />);

    expect(screen.getByText(/Tool: WebSearch/i)).toBeInTheDocument();
    expect(screen.getByLabelText('output-data')).toHaveTextContent('Found 5 results');
  });
});