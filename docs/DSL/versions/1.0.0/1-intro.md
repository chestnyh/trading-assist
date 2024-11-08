# Intro

The main reason for this documentation is to describe main parts of language, how they work, etc...

The language parts:

## Root

Root level is an array. That consist sequence of items.

## Item

This is unit of the DSL. Item can consist other item(s). and have different types.

Each item has:

**`type`[required]{enum}** - describes type of this item and describes it behavior. And the type of the item defines other structure of the item.

**`id`[required]{number}** - identifier of the item in case you heed to get back to it from other item. id should be unique over all flow.

**`name`[optional]{string}** - name of the item. Could be arbitrary and don't used in functionality. Just informational functionality

**`description`[optional]{string}** - just informational functionality. in case if you need description for the item.

Example of the item
```
{
    "type": "sequence",
    "id": 0,
    "name": "Root item",
    "description": "This is a root item which describe the whole flow",
    ... other parts of the item that their type defines    
}
```

**What item types we may have?**
 
 - **sequence** - item that consist other items and execute them sequently one by one.
 - **parallel** - item that consist other items and execute them in parallel.
 - **condition** - item that can specify some conditions and define what operations should be called under what conditions.
 - **operation** - item that perform some real action, like notify user, create order, cancel orders.

### sequence

Sequence item allows to specify list of items that will be executed sequently(one by one)

Example:
```json
{
    "type": "sequence",
    "sequence": [
        // ... one or more item that should be called sequently
    ]
}
```

### parallel

Parallel item also specify list of operations that will be executed, but they will be executed in parallel manner.

Example:
```json
{
    "type": "parallel",
    "parallel": []
}
```

### condition

Condition item allows you to execute operations based on specified conditions. The condition item requires three main parts:

- **`__if`[required]** - specifies the condition that needs to be evaluated
- **`__then`[required]** - specifies what item should be executed if the condition is true
- **`__else`[optional]** - specifies what item should be executed if the condition is false

The condition rules and syntax are described in detail in the [conditions section](2-conditions.md).

Example: 
```json
{
    "type": "condition",
    "condition": {
        "__if": {
            // ... conditions
        },
        "__then": {
            // ... item to call under this condition
        },
        "__else": {
            // ... item to call if condition doesn't match
        }
    }
}

```

### operation

An operation item represents a concrete action that will be executed. It's the lowest-level executable unit in the DSL that performs actual tasks like creating orders, sending notifications, etc. list of all possible operations with their description you can find [here](3-operations.md)

Fields: 

- **`type`** [required]: Must be set to "operation" to indicate this is an operation item
- **`operation`** [required]: Specifies which operation to execute (e.g., creating orders, sending notifications)
- **`args`** [required]: Object containing operation-specific arguments


Example:
```json
{
    "type": "operation",
    "operation": "some_operations_from_available",
    "args": {
        // Arguments names may differ from operation to operation
        "argument1": "some_value",
        "argument2": "some_other_value"  
    }
}
```