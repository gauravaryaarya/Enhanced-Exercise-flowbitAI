import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../src/components/Sidebar';
import React from 'react';

describe('Sidebar Component', () => {
  // FIX: Updated mockProps to include the newest Highlight/Select props
  const mockProps = {
    onSearch: vi.fn(),
    areas: [],
    onDeleteArea: vi.fn(),
    onConfirm: vi.fn(),
    onBack: vi.fn(),
    viewMode: 'search' as const,
    showLayer: true,
    toggleLayer: vi.fn(),
    onToggleAreaVisibility: vi.fn(),
    onSelectArea: vi.fn(),       // <--- NEW PROP
    selectedAreaIndex: null      // <--- NEW PROP
  };

  it('renders the search input in search mode', () => {
    render(<Sidebar {...mockProps} />);
    // Verify placeholder matches the component
    expect(screen.getByPlaceholderText('Type a city name (e.g. London)')).toBeInTheDocument();
  });

  it('calls onSearch when user types and submits (Enter key)', () => {
    render(<Sidebar {...mockProps} />);
    
    // 1. Find input and type 'Berlin'
    const input = screen.getByPlaceholderText('Type a city name (e.g. London)');
    fireEvent.change(input, { target: { value: 'Berlin' } });
    
    // 2. Simulate Form Submission (Enter Key)
    fireEvent.submit(input);
    
    // 3. Verify the parent function was called
    expect(mockProps.onSearch).toHaveBeenCalledWith('Berlin');
  });

  it('switches to scope view and shows layers', () => {
    render(<Sidebar {...mockProps} viewMode="scope" />);
    
    // Check if the "Base Layers" text is visible
    expect(screen.getByText('Base Layers')).toBeInTheDocument();
    
    // Check if "Define Area of Interest" is visible
    expect(screen.getByText('Define Area of Interest')).toBeInTheDocument();
  });
});