import { useFilterStore } from '../useFilterStore';

describe('useFilterStore', () => {
  beforeEach(() => {
    useFilterStore.setState({ selectedFilter: 'Title' });
  });

  it('should have initial state', () => {
    const state = useFilterStore.getState();
    expect(state.selectedFilter).toBe('Title');
  });

  it('should set selectedFilter', () => {
    useFilterStore.getState().setSelectedFilter('Author');
    const state = useFilterStore.getState();
    expect(state.selectedFilter).toBe('Author');
  });
});
