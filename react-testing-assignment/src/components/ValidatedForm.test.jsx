import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ValidatedForm from './ValidatedForm';

describe('ValidatedForm Component', () => {
  it('shows validation error when submitting empty form', async () => {
    render(<ValidatedForm onSubmit={() => {}} />);
    
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitBtn);

    expect(screen.getByRole('alert')).toHaveTextContent('Field cannot be empty');
  });

  it('submits successfully when valid text is provided', async () => {
    const mockSubmit = vi.fn();
    render(<ValidatedForm onSubmit={mockSubmit} />);

    const input = screen.getByLabelText(/enter prompt/i);
    await userEvent.type(input, 'Hello AI');

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledWith('Hello AI');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});