import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard';
import * as router from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AdminDashboard when logged in', () => {
  beforeEach(() => {
    localStorage.setItem('admin_token', 'fake');
    localStorage.setItem('admin_user', 'sam');
    mockNavigate.mockReset();
  });

  afterEach(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  });

  it('shows the signed in username', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Signed in as/i)).toBeInTheDocument();
    expect(screen.getByText(/sam/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});