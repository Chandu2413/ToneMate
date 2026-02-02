import React from 'react';
import { render } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AdminDashboard', () => {
  beforeEach(() => { localStorage.removeItem('admin_token'); mockNavigate.mockReset(); });

  it('redirects to login when no token', () => {
    render(<AdminDashboard />);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
  });
});
