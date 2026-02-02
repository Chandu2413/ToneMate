import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorMatch from '../ColorMatch';

describe('ColorMatch', () => {
  it('renders gallery and allows selection', () => {
    render(<ColorMatch />);

    const gallery = screen.getByRole('listbox', { name: /Dress gallery/i });
    expect(gallery).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);

    // click second option
    const second = options[1];
    fireEvent.click(second);
    expect(second).toHaveAttribute('aria-selected', 'true');

    // canvases present
    const canvases = screen.getAllByRole('img', { hidden: true });
    // fallback: ensure at least one canvas element present
    const canvasEls = document.querySelectorAll('canvas');
    expect(canvasEls.length).toBeGreaterThanOrEqual(2);
  });
});
