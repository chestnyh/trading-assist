import cronLib from 'node-cron';

export default function cron(
    {
        schedule,
        do: operation
    },
    {
        sequenceContext
    },
    settings: any
): void {

    console.log(schedule);

    cronLib.schedule(schedule, () => {
        this[operation.type](
            operation.arguments,
            {
                sequenceContext
            },
            settings
        );
    });

    return;
} 