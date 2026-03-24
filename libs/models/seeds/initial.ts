import logRule from './units/rules/1-log';
import timeoutRule from './units/rules/2-timeout';
import intervalRule from './units/rules/3-interval';
import sequenceRule from './units/rules/4-sequence';
import parallelRule from './units/rules/5-parallel';
// TODO: should make it @trading-bot/crypto-utils
import { CryptoUtilsService } from '../../crypto-utils/src/lib/crypto-utils.service';

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
                    password: await cryptoService.hashPassword('password'),
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
                    }
                },
                update: {}
            }
        ]
    }
};