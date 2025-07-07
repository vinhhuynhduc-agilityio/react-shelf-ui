import { act } from '@testing-library/react';
import { useBookStore } from '../bookStore';

describe('useBookStore', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useBookStore.setState({ books: [], hasFetched: false });
  });

  it('should have initial state', () => {
    const state = useBookStore.getState();
    expect(state.books).toEqual([]);
    expect(state.hasFetched).toBe(false);
  });

  it('should set books and hasFetched', () => {
    const books = [
      { id: '1', title: 'Book 1', author: { name: '', bio: '' }, category: '', publishedYear: 2020, rating: 0, imageUrl: '' },
      { id: '2', title: 'Book 2', author: { name: '', bio: '' }, category: '', publishedYear: 2021, rating: 0, imageUrl: '' },
    ];
    act(() => {
      useBookStore.getState().setBooks(books);
    });
    const state = useBookStore.getState();
    expect(state.books).toEqual(books);
    expect(state.hasFetched).toBe(true);
  });
});
