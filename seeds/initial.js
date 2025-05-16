const logRule = require('../data/rules/1-log.json');

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
                }
            },
            update: {}
        }
    ]
}