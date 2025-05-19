const logRule = require('./units/rules/1-log.json');

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