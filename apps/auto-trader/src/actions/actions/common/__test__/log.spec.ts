import { ActionsHub } from '../../../action-hub';
import ObjectNavigator from '@trading-bot/object-navigator';

describe('log', () => {
    let sequenceContext;
    let actionsHub: ActionsHub;
    let mockRuleLogsService: { publishLog: jest.Mock };
    
    beforeEach(() => {
        mockRuleLogsService = {
            publishLog: jest.fn().mockResolvedValue(undefined)
        };
        actionsHub = new ActionsHub(1, 1, {}, {}, 'test-run', mockRuleLogsService as any);
        sequenceContext = new ObjectNavigator();
    });

    it('should log a message', async () => {
        const message = 'This message should be logged';
        await actionsHub['log']({message}, { sequenceContext });
        expect(mockRuleLogsService.publishLog).toHaveBeenCalled();
        const callArg = mockRuleLogsService.publishLog.mock.calls[0][0];
        expect(callArg.message).toBe(message);
        expect(callArg.level).toBe('info');
    });

    it('should log a message with data from heap', async () => {
        actionsHub['heap'] = new ObjectNavigator({
            user: {
                name: 'John',
                address: '123 Main St, Anytown, USA'
            }
        });
        const message = 'User Information = ${__heap__.user.name} ${__heap__.user.address}';
        await actionsHub['log']({message}, { sequenceContext });
        expect(mockRuleLogsService.publishLog).toHaveBeenCalled();
        const callArg = mockRuleLogsService.publishLog.mock.calls[0][0];
        expect(callArg.message).toBe('User Information = John 123 Main St, Anytown, USA');
    });

    it('should log a message with a data from sequence context', async () => {
        sequenceContext = new ObjectNavigator({
            deposit: {
                amount: 1000,
                date: '2021-01-01'
            }
        });
        const message = 'Deposit Information = amount:${__sequenceContext__.deposit.amount}, date: ${__sequenceContext__.deposit.date}';
        await actionsHub['log']({message}, { sequenceContext });
        expect(mockRuleLogsService.publishLog).toHaveBeenCalled();
        const callArg = mockRuleLogsService.publishLog.mock.calls[0][0];
        expect(callArg.message).toBe('Deposit Information = amount:1000, date: 2021-01-01');
    });

    it('should log a message with a data from heap and sequence context', async () => {
        sequenceContext = new ObjectNavigator({
            deposit: {
                amount: 8000,
                date: '2023-01-01'
            }
        });
        actionsHub['heap'] = new ObjectNavigator({
            user: {
                id: 876,
                firstName: 'Eva',
                lastName: 'Smith'
            }
        });
        const message = 'User (id: ${__heap__.user.id}, name: ${__heap__.user.firstName} ${__heap__.user.lastName}) opened deposit (amount:${__sequenceContext__.deposit.amount}, date: ${__sequenceContext__.deposit.date})';
        await actionsHub['log']({message}, { sequenceContext });
        expect(mockRuleLogsService.publishLog).toHaveBeenCalled();
        const callArg = mockRuleLogsService.publishLog.mock.calls[0][0];
        expect(callArg.message).toBe('User (id: 876, name: Eva Smith) opened deposit (amount:8000, date: 2023-01-01)');
    });

    it('should log an empty message if no message is provided', async () => {
        await actionsHub['log']({}, { sequenceContext });
        expect(mockRuleLogsService.publishLog).toHaveBeenCalled();
        const callArg = mockRuleLogsService.publishLog.mock.calls[0][0];
        expect(callArg.message).toBe('');
    });

    it('should log a undefined if no information in heap and sequence context', async () => {
        sequenceContext = new ObjectNavigator({});
        actionsHub['heap'] = new ObjectNavigator({});
        const message = 'User (id: ${__heap__.user.id}, name: ${__heap__.user.firstName} ${__heap__.user.lastName}) opened deposit (amount:${__sequenceContext__.deposit.amount}, date: ${__sequenceContext__.deposit.date})';
        await actionsHub['log']({message}, { sequenceContext });
        expect(mockRuleLogsService.publishLog).toHaveBeenCalled();
        const callArg = mockRuleLogsService.publishLog.mock.calls[0][0];
        expect(callArg.message).toBe('User (id: undefined, name: undefined undefined) opened deposit (amount:undefined, date: undefined)');
    });
    
});
