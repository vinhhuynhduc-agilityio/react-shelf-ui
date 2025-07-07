import { usePendingShelfStore } from '../usePendingShelfStore';

describe('usePendingShelfStore', () => {
  beforeEach(() => {
    usePendingShelfStore.setState({ pendingShelfActions: [] });
  });

  it('should have initial state', () => {
    expect(usePendingShelfStore.getState().pendingShelfActions).toEqual([]);
  });

  it('should add pending id', () => {
    usePendingShelfStore.getState().addPending('a');
    expect(usePendingShelfStore.getState().pendingShelfActions).toEqual(['a']);
  });

  it('should remove pending id', () => {
    usePendingShelfStore.setState({ pendingShelfActions: ['a', 'b'] });
    usePendingShelfStore.getState().removePending('a');
    expect(usePendingShelfStore.getState().pendingShelfActions).toEqual(['b']);
  });
});
