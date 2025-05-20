import { ActionsHub } from '../../../action-hub';
import ObjectNavigator from 'libs/object-navigator/src/lib/object-navigator';

describe('log', () => {
    let sequenceContext;
    let actionsHub: ActionsHub;
    let originalConsoleLog: typeof console.log;
    
    beforeEach(() => {
        actionsHub = new ActionsHub(['log']);
        sequenceContext = new ObjectNavigator();
        originalConsoleLog = console.log;
        console.log = jest.fn();
    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    it('should log a message', () => {
        const message = 'This message should be logged';
        actionsHub['log']({message}, { sequenceContext });
        expect(console.log).toHaveBeenCalledWith(message);
    });

    it('should log a message with data from heap', () => {
        actionsHub['heap'] = new ObjectNavigator({
            user: {
                name: 'John',
                address: '123 Main St, Anytown, USA'
            }
        });
        const message = 'User Information = ${__heap__.user.name} ${__heap__.user.address}';
        actionsHub['log']({message}, { sequenceContext });
        expect(console.log).toHaveBeenCalledWith(`User Information = John 123 Main St, Anytown, USA`);
    });

    it('should log a message with a data from sequence context', () => {
        sequenceContext = new ObjectNavigator({
            deposit: {
                amount: 1000,
                date: '2021-01-01'
            }
        });
        const message = 'Deposit Information = amount:${__sequenceContext__.deposit.amount}, date: ${__sequenceContext__.deposit.date}';
        actionsHub['log']({message}, { sequenceContext });
        expect(console.log).toHaveBeenCalledWith(`Deposit Information = amount:1000, date: 2021-01-01`);
    });

    it('should log a message with a data from heap and sequence context', () => {
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
        actionsHub['log']({message}, { sequenceContext });
        expect(console.log).toHaveBeenCalledWith('User (id: 876, name: Eva Smith) opened deposit (amount:8000, date: 2023-01-01)');
    });

    it('should log an empty message if no message is provided', () => {
        actionsHub['log']({}, { sequenceContext });
        expect(console.log).toHaveBeenCalledWith('');
    });

    it('should log a undefined if no information in heap and sequence context', () => {
        sequenceContext = new ObjectNavigator({});
        actionsHub['heap'] = new ObjectNavigator({});
        const message = 'User (id: ${__heap__.user.id}, name: ${__heap__.user.firstName} ${__heap__.user.lastName}) opened deposit (amount:${__sequenceContext__.deposit.amount}, date: ${__sequenceContext__.deposit.date})';
        actionsHub['log']({message}, { sequenceContext });
        expect(console.log).toHaveBeenCalledWith('User (id: undefined, name: undefined undefined) opened deposit (amount:undefined, date: undefined)');
    });
    
});
