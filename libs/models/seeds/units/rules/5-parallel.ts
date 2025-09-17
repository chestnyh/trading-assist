export default {
    "name": "Parallel",
    "description": "Action to run multiple actions in parallel",
    "type": "parallel",
    "arguments": {
        "do": [
            {
                "type": "timeout",
                "arguments": {
                    "do": {
                        "type": "log",
                        "arguments": {
                            "message": "Parallel message 1"
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
                            "message": "Parallel message 2"
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
                            "message": "Parallel message 3"
                        }
                    },
                    "timeout": 1000
                }
            }
        ]
    }
}