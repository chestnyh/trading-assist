export default function stop_sequence(
    _args: any,
    {
        sequenceContext,
    }: {
        sequenceContext?: { set: (key: string, data: any) => void };
    } = {}
): void {
    if (sequenceContext && typeof sequenceContext.set === 'function') {
        sequenceContext.set('__stop_sequence__', true);
    }
}
