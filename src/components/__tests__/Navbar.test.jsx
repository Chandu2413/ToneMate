import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../Navbar';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar', () => {
  beforeEach(() => localStorage.removeItem('admin_token'));

  it('shows Admin when not logged in', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  });

  it('shows Logout and username when logged in and clears token/user on click', async () => {
    localStorage.setItem('admin_token', 'fake');
    localStorage.setItem('admin_user', 'sam');
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.getByText(/sam/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Logout/i));
    // token and user should be removed (logout import is async)
    await waitFor(() => expect(localStorage.getItem('admin_token')).toBeNull());
    await waitFor(() => expect(localStorage.getItem('admin_user')).toBeNull());
  });
});
