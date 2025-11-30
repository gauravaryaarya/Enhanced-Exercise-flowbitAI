import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../src/components/Sidebar';

describe('Sidebar Component', () => {
  const mockProps = {
    onSearch: vi.fn(),
    areas: [],
    onDeleteArea: vi.fn(),
    onConfirm: vi.fn(),
    viewMode: 'search' as const,
    showLabels: true,
    toggleLabels: vi.fn()
  };

  it('renders the search input in search mode', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByPlaceholderText('Cologne City Proper')).toBeInTheDocument();
  });

  it('calls onSearch when search button is clicked', () => {
    render(<Sidebar {...mockProps} />);
    const input = screen.getByPlaceholderText('Cologne City Proper');
    fireEvent.change(input, { target: { value: 'Berlin' } });
    
    const button = screen.getByText('Apply outline as base image');
    fireEvent.click(button);
    
    expect(mockProps.onSearch).toHaveBeenCalledWith('Berlin');
  });
});