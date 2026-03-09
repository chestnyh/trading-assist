# auto-trader

Auto-Trder is a background service that loads trading rules for all users from the database and executes them automatically on startup.

## How it works

On startup the service fetches all rules with settings. For each rule it creates an `ActionsRunner` instance and starts executing it immediately. Rules run continuously until the service stops or rule designed in a such way that it execute and die.

## Rule execution

Each rule is a JSON document describing a tree of actions to execute. The `ActionsRunner` interprets this document using an `ActionsHub`, which dispatches each action by type.

A shared heap (in-memory key/value store) is available to all actions within a rule, allowing them to read and write data across steps.

[Documentation about the rule's actions we have](./_docs/actions-documentation/README.md)