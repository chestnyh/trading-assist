# DSL(Domain Specific Language)

The Trading Bot Platform uses a JSON-based Domain Specific Language (DSL) to define trading bot behavior and configuration. This DSL provides a structured way to specify conditions, and actions. The DLS is versioned to ensure backward compatibility and clear upgrade paths. This DSLl have nested structure. The first level is common for all versions and consist of:
 - `version`{string} - version of the language.
 - `main` {Array} - This part describe the conditions and actions and have specified rules how to describe it, but these rules may be different from version to version. 

Example: 
```json
{
    "version": "1.0.0",
    "main": [
        // Here we describe how bot should react on market changes
    ]
}
```