import getValue from '../../utils/get-value.util'
/**
 * Action that logs messages to the terminal for debugging purposes.
 * Note: These logs are temporary and will be cleared when the terminal is cleared.
 * Documentation - 
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default function log(
    {
        message = ""
    },
    {
        sequenceContext = {}
    }
) {
    const matches = message.match(/\${(.*?)}/g);
    if (matches) {
        matches.forEach(match => {
            const valueKey = match.replace('${', '').replace('}', '');
            const value = getValue(valueKey, { heap: this.heap, sequenceContext });
            message = message.replace(match, value);
        });
    }
    console.log(message);
}