import { ActionsHub } from '../../../action-hub';
import ObjectNavigator from '@trading-bot/object-navigator';

describe('sequence with stop_sequence', () => {
    let actionsHub: ActionsHub;
    let sequenceContext: ObjectNavigator;
    let originalConsoleLog: typeof console.log;

    beforeEach(() => {
        actionsHub = new ActionsHub(
            1,           // ruleId
            1,           // userId
            {},          // ruleBody
            {},          // settings
            'test-run',  // runId
            null         // ruleLogsService
        );
        sequenceContext = new ObjectNavigator();
        originalConsoleLog = console.log;
        console.log = jest.fn();
    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    it('should stop parent sequence when stop_sequence is directly in if_then array', async () => {
        const executed: string[] = [];

        // Mock debug action
        const originalDebug = (actionsHub as any)['debug'];
        (actionsHub as any)['debug'] = async (args: any, ctx: any) => {
            executed.push(`debug: ${args.message}`);
            if (originalDebug) {
                return originalDebug.call(actionsHub, args, ctx);
            }
        };

        const config = {
            do: [
                {
                    type: 'debug',
                    arguments: { message: 'Step 1' }
                },
                {
                    type: 'if_then',
                    arguments: {
                        if: {
                            type: 'resolve',
                            arguments: { expression: { __const: true } }
                        },
                        then: [
                            {
                                type: 'debug',
                                arguments: { message: 'Error Happened' }
                            },
                            {
                                type: 'stop_sequence',
                                arguments: {}
                            }
                        ]
                    }
                },
                {
                    type: 'debug',
                    arguments: { message: 'After if_then (SHOULD NOT SEE THIS!)' }
                }
            ]
        };

        await (actionsHub as any)['sequence'](config, {
            sequenceContext,
            heap: new ObjectNavigator()
        });

        console.log('Executed actions:', executed);

        // Should see Step 1 and Error Happened
        expect(executed).toContain('debug: Step 1');
        expect(executed).toContain('debug: Error Happened');

        // Should NOT see the action after stop_sequence
        expect(executed).not.toContain('debug: After if_then (SHOULD NOT SEE THIS!)');
    });
});
