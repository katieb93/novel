import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManuscriptSearch from '../manuscriptSearch/manuscriptSearch';
import { supabase } from '../supabaseClient';

// Mock Supabase client to avoid testing actual Supabase functionality
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('ManuscriptSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the ManuscriptSearch component correctly without Supabase interactions', async () => {
    // Mock Supabase responses with dummy data
    supabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
        },
      },
    });

    supabase.from.mockImplementation((table) => {
      switch (table) {
        case 'genre_data':
          return {
            select: jest.fn().mockResolvedValue({
              data: [
                { broad_genre: 'Fiction', subGenres: [] },
                { broad_genre: 'Non-Fiction', subGenres: [] },
              ],
              error: null,
            }),
          };
        case 'projects_author':
          return {
            select: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 1,
                  user_id: '123',
                  title: 'Test Project',
                  broad_genre: 'Fiction',
                  category: 'Novel',
                  genre: 'Drama',
                },
              ],
              error: null,
            }),
          };
        default:
          return { select: jest.fn().mockResolvedValue({ data: [], error: null }) };
      }
    });

    render(<ManuscriptSearch />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Search')).toBeInTheDocument();
    });
  });

  it('displays user data correctly after mock fetching', async () => {
    // Mock Supabase responses with dummy data
    supabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
        },
      },
    });

    supabase.from.mockImplementation((table) => {
      switch (table) {
        case 'genre_data':
          return {
            select: jest.fn().mockResolvedValue({
              data: [
                { broad_genre: 'Fiction', subGenres: [] },
                { broad_genre: 'Non-Fiction', subGenres: [] },
              ],
              error: null,
            }),
          };
        case 'projects_author':
          return {
            select: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          };
        default:
          return { select: jest.fn().mockResolvedValue({ data: [], error: null }) };
      }
    });

    render(<ManuscriptSearch />);

    await waitFor(() => {
      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });
});
