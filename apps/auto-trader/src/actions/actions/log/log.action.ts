/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default function log (
    args: any, 
    {
        heap,
        dependencies,
        sequenceContext
    }) {

    const { 
        message,  
    } = args;

    console.log(message);
    
}