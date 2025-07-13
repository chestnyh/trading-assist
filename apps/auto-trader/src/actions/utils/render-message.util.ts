
import getValue from './get-value.util';

/**
 * TODO add description
 * @param message 
 * @param param1 
 * @returns 
 */
export default function renderMessage(message, {heap, sequenceContext}) {
    const matches = message.match(/\${(.*?)}/g);
    if (matches) {
        matches.forEach(match => {
            const valueKey = match.replace('${', '').replace('}', '');
            const value = getValue(valueKey, { heap, sequenceContext });
            message = message.replace(match, value);
        });
    }
    return message;
}