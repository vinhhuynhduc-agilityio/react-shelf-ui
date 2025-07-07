import { useSearchStore } from '../useSearchStore';

describe('useSearchStore', () => {
  beforeEach(() => {
    useSearchStore.setState({ searchTerm: '', searchFromSidebar: false, valueSearch: '' });
  });

  it('should have initial state', () => {
    const state = useSearchStore.getState();
    expect(state.searchTerm).toBe('');
    expect(state.searchFromSidebar).toBe(false);
    expect(state.valueSearch).toBe('');
  });

  it('should set searchTerm', () => {
    useSearchStore.getState().setSearchTerm('abc');
    expect(useSearchStore.getState().searchTerm).toBe('abc');
  });

  it('should set searchFromSidebar', () => {
    useSearchStore.getState().setSearchFromSidebar(true);
    expect(useSearchStore.getState().searchFromSidebar).toBe(true);
  });

  it('should set valueSearch', () => {
    useSearchStore.getState().setValueSearch('xyz');
    expect(useSearchStore.getState().valueSearch).toBe('xyz');
  });
});
