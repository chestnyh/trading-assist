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
        externalServices: [
            { where: { name: 'Binance' }, create: { name: 'Binance' }, update: {} },
            { where: { name: 'Bybit' }, create: { name: 'Bybit' }, update: {} },
            { where: { name: 'Kraken' }, create: { name: 'Kraken' }, update: {} },
            { where: { name: 'Telegram' }, create: { name: 'Telegram' }, update: {} },
            { where: { name: 'Email' }, create: { name: 'Email' }, update: {} },
            { where: { name: 'Discord Webhooks' }, create: { name: 'Discord Webhooks' }, update: {} },
            { where: { name: 'Slack Webhooks' }, create: { name: 'Slack Webhooks' }, update: {} },
            { where: { name: 'SMS (Twilio)' }, create: { name: 'SMS (Twilio)' }, update: {} },
            { where: { name: 'Push Notifications (OneSignal)' }, create: { name: 'Push Notifications (OneSignal)' }, update: {} },
            { where: { name: 'WhatsApp Business API' }, create: { name: 'WhatsApp Business API' }, update: {} },
            { where: { name: 'Webhooks' }, create: { name: 'Webhooks' }, update: {} },
        ],
        user: [
            {
                where: {
                    email: 'admin@tb.com',
                },
                create: {
                    email: 'admin@tb.com',
                    nickname: 'admin',
                    password: await cryptoService.hashPassword('password'),
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
                    },
                    ruleSettings : {
                        create: [
                            {
                                name: "Production Binance Bot",
                                code: "code",
                                description: "Real-world example with fake credentials",
                                externalService: {
                                    connect: { name: 'Binance' }
                                    },
                                configuration: {
                                    service: "Binance",
                                    config: {
                                            apiKey: "b1n4nc3_4p1_k3y_32_ch4rs_l0ng_123",
                                            apiSecret: "s3cr3t_64_ch4rs_l0ng_v3ry_v3ry_v3ry_v3ry_v3ry_v3ry_v3ry_v3ry_1234",
                                            baseUrl: "https://api.binance.com"
                                        }
                                    }
                            }
                        ]
                    }
                },
                update: {}
            }
        ]
    }
};