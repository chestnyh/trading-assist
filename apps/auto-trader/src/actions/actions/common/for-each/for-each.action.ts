import ObjectNavigator from 'libs/object-navigator/src/lib/object-navigator';


export default async function for_each(
    args: any,
    {
        sequenceContext
    }
): Promise<void> {

    let array = args.array;
    let operations = args.do;

    const arrayOperation = array.type;
    const operationsType = operations.type;

    array = this[arrayOperation](
        array.arguments,
        {
            sequenceContext
        }
    );

    array.forEach(item => {
        this[operationsType](
            operations.arguments,
            {
                sequenceContext: new ObjectNavigator(item),
            }
        );
    })
} 