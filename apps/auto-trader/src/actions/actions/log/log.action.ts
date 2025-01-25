/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default function log (
    args: any, 
    {
        sequenceContext
    }) {

    const { 
        message,  
    } = args;

    console.log(message);
    
}