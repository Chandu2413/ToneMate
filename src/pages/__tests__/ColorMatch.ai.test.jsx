import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ColorMatch from '../ColorMatch';

vi.mock('../../services/aiService', () => ({
  colorMatch: vi.fn().mockResolvedValue({ description: 'Nice combo', matchScore: 95 })
}));

describe('ColorMatch AI evaluate', () => {
  it('shows AI response after Evaluate', async () => {
    render(<ColorMatch />);

    const btn = screen.getByRole('button', { name: /Evaluate Outfit/i });
    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByText(/Nice combo/i)).toBeInTheDocument());
  });
});
