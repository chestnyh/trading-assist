import { ActionsHub } from '../../../action-hub';
import ObjectNavigator from 'libs/object-navigator/src/lib/object-navigator';

describe('timeout', () => {
  let sequenceContext;
  let actionsHub: ActionsHub;

  beforeEach(() => {
    jest.useFakeTimers();
    actionsHub = new ActionsHub(['timeout']);
    sequenceContext = new ObjectNavigator();
    actionsHub['mock'] = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    actionsHub['mock'].mockClear();
  });

  it('should call the action after the timeout', async () => {
    const args = {
      timeout: 1000, 
      do: { 
        type: 'mock', 
        arguments: 8888
      }
    };
    const promise = actionsHub['timeout'](args, { sequenceContext });
    expect(actionsHub['mock']).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    await promise;
    expect(actionsHub['mock']).toHaveBeenCalledWith(8888, { sequenceContext });
  });

});
