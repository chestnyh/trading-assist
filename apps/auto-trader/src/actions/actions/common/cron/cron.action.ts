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

    const self = this as any;
    if (!self.__disposers) {
        self.__disposers = [];
    }
    self.__disposers.push(() => task.stop());

    return;
}