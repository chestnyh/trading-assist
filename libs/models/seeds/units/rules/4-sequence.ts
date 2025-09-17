export default {
    "name": "Sequence",
    "description": "Action to run multiple actions in sequence",
    "type": "sequence",
    "arguments": {
        "do": [
            {
                "type": "timeout",
                "arguments": {
                    "do": {
                        "type": "log",
                        "arguments": {
                            "message": "Sequence message 1"
                        }
                    },
                    "timeout": 3000
                }
            },
            {
                "type": "timeout",
                "arguments": {
                    "do": {
                        "type": "log",
                        "arguments": {
                            "message": "Sequence message 2"
                        }
                    },
                    "timeout": 2000
                }
            },
            {
                "type": "timeout",
                "arguments": {
                    "do": {
                        "type": "log",
                        "arguments": {
                            "message": "Sequence message 3"
                        }
                    },
                    "timeout": 1000
                }
            }
        ]
    }
}