const logRule = require('./units/rules/1-log.json');
const timeoutRule = require('./units/rules/2-timeout.json');
const intervalRule = require('./units/rules/3-interval.json');
const sequenceRule = require('./units/rules/4-sequence.json');
const parallelRule = require('./units/rules/5-parallel.json');

module.exports = {
    user: [
        {
            where: {
                email: 'admin@tb.com',
            },
            create: {
                email: 'admin1@tb.com',
                nickname: 'admin1',
                password: 'password',
                rules: {
                    create: [
                        {
                            name: "Initial Config",
                            description: "Initial config ",
                            ruleBody: logRule
                        },
                        {
                            name: "Timeout Config",
                            description: "Timeout config",
                            ruleBody: timeoutRule
                        },
                        {
                            name: "Interval Config",
                            description: "Interval config",
                            ruleBody: intervalRule
                        },
                        {
                            name: "Sequence Config",
                            description: "Sequence config",
                            ruleBody: sequenceRule
                        },
                        {
                            name: "Parallel Config",
                            description: "Parallel config",
                            ruleBody: parallelRule
                        }
                    ]
                },
                telegramSettings: {
                    create: [
                        {
                            name: 'Telegram Settings',
                            description: 'Telegram settings',
                            apiToken: '1234567890',
                        }
                    ]
                }
            },
            update: {}
        }
    ]
}