import logRule from './units/rules/1-log';
import timeoutRule from './units/rules/2-timeout';
import intervalRule from './units/rules/3-interval';
import sequenceRule from './units/rules/4-sequence';
import parallelRule from './units/rules/5-parallel';
// TODO: should make it @trading-bot/crypto-utils
import { CryptoUtilsService } from '@trading-bot/crypto-utils';

const cryptoService = new CryptoUtilsService();

export default async function main() {
    return {
        user: [
            {
                where: {
                    email: 'admin@tb.com',
                },
                create: {
                    email: 'admin@tb.com',
                    nickname: 'admin',
                    password: await cryptoService.hashPassword('Admin123!'),
                    firstName: 'Admin',
                    lastName: 'User',
                    emailVerificationToken: 'initial-seed-token',
                    emailVerificationCode: '123456',
                    isEmailVerified: true,
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
                update: {
                    password: await cryptoService.hashPassword('Admin123!'),
                }
            }
        ]
    }
};
