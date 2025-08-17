import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from './input-field';

describe('InputField', () => {
  it('renders with label and placeholder', () => {
    render(
      <InputField 
        label="Test Label" 
        placeholder="Test placeholder" 
      />
    );
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(
      <InputField 
        value="initial" 
        onChange={handleChange}
        label="Test Input"
      />
    );
    
    const input = screen.getByLabelText('Test Input');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message when invalid', () => {
    render(
      <InputField 
        label="Test Input"
        invalid
        errorMessage="This field is required"
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <InputField 
        label="Test Input"
        helperText="Enter your email address"
      />
    );
    
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(
      <InputField 
        label="Small Input"
        size="sm"
        data-testid="input-sm"
      />
    );
    
    expect(screen.getByTestId('input-sm')).toHaveClass('h-8');
    
    rerender(
      <InputField 
        label="Large Input"
        size="lg"
        data-testid="input-lg"
      />
    );
    
    expect(screen.getByTestId('input-lg')).toHaveClass('h-12');
  });

  it('shows clear button when enabled and has value', () => {
    render(
      <InputField 
        label="Test Input"
        value="some value"
        showClearButton
      />
    );
    
    expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
  });

  it('shows password toggle for password inputs', () => {
    render(
      <InputField 
        label="Password"
        type="password"
        showPasswordToggle
      />
    );
    
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    render(
      <InputField 
        label="Loading Input"
        loading
      />
    );
    
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <InputField 
        label="Disabled Input"
        disabled
      />
    );
    
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(
      <InputField 
        label="Filled Input"
        variant="filled"
        data-testid="input-filled"
      />
    );
    
    expect(screen.getByTestId('input-filled')).toHaveClass('bg-muted');
    
    rerender(
      <InputField 
        label="Ghost Input"
        variant="ghost"
        data-testid="input-ghost"
      />
    );
    
    expect(screen.getByTestId('input-ghost')).toHaveClass('bg-transparent');
  });
});
