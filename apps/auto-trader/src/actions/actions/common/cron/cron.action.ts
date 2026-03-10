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

    const task = cronLib.schedule(schedule, () => {
        this[operation.type](
            operation.arguments,
            {
                sequenceContext
            }
        );
    });

    this.addDisposer(() => task.stop());

    return;
}