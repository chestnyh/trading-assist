import cronLib from 'node-cron';

export default function cron(
    {
        schedule,
        do: operation
    },
    {
        sequenceContext
    }
): void {

    cronLib.schedule(schedule, () => {
        this[operation.type](
            operation.arguments,
            {
                sequenceContext
            }
        );
    });

    return;
} 