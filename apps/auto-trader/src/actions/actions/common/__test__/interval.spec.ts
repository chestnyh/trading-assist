import { ActionsHub } from '../../../action-hub';
import ObjectNavigator from '@trading-bot/object-navigator';

describe('timeout', () => {
  let sequenceContext;
  let actionsHub: ActionsHub;

  beforeEach(() => {
    jest.useFakeTimers();
    actionsHub = new ActionsHub(['interval']);
    sequenceContext = new ObjectNavigator();
    actionsHub['mock'] = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    actionsHub['mock'].mockClear();
  });

  it('should call the action after the interval', async () => {
    const args = {
      interval: 1000, 
      do: { 
        type: 'mock', 
        arguments: 8888
      }
    };
    actionsHub['interval'](args, { sequenceContext });
    expect(actionsHub['mock']).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(actionsHub['mock']).toHaveBeenCalledWith(8888, { sequenceContext });
    jest.advanceTimersByTime(1000);
    expect(actionsHub['mock']).toHaveBeenCalledTimes(2);
    expect(actionsHub['mock']).toHaveBeenLastCalledWith(8888, { sequenceContext });
    jest.advanceTimersByTime(1000);
    expect(actionsHub['mock']).toHaveBeenCalledTimes(3);
    expect(actionsHub['mock']).toHaveBeenLastCalledWith(8888, { sequenceContext });
  });
  
});
