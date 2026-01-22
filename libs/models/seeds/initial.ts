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
                    ruleSettings: {
                        create: [
                            {
                                name: "Binance Production",
                                code: "binance_prod_001",
                                description: "Binance trading bot credentials",
                                externalService: { connect: { name: 'Binance' } },
                                configuration: {
                                    apiKey: "binance_api_key_32_chars_long_12",
                                    apiSecret: "binance_secret_64_chars_long_v3ry_v3ry_v3ry_v3ry_v3ry_v3ry_v3ry_64",
                                    baseUrl: "https://api.binance.com"
                                }
                            },
                            {
                                name: "Bybit Scalper",
                                code: "bybit_scalp_002",
                                description: "Bybit exchange settings",
                                externalService: { connect: { name: 'Bybit' } },
                                configuration: {
                                    apiKey: "bybit_api_key_32_chars_long_1234",
                                    apiSecret: "bybit_secret_64_chars_long_v3ry_v3ry_v3ry_v3ry_v3ry_v3ry_v3ry_v34",
                                    baseUrl: "https://api.bybit.com"
                                }
                            },
                            {
                                name: "Kraken High-Frequency",
                                code: "kraken_hft_003",
                                description: "Kraken exchange credentials",
                                externalService: { connect: { name: 'Kraken' } },
                                configuration: {
                                    apiKey: "kraken_api_key_exactly_56_characters_long_for_validation_1",
                                    apiSecret: "kraken_secret_exactly_88_characters_long_for_validation_purposes_only_123456789012345678",
                                    baseUrl: "https://api.kraken.com"
                                }
                            },
                            {
                                name: "Telegram Notifier",
                                code: "tg_bot_004",
                                description: "Telegram bot for alerts",
                                externalService: { connect: { name: 'Telegram' } },
                                configuration: {
                                    botToken: "123456789:ABCDefGhIJKlmNoPQRstuVWXyz_45chars",
                                    baseUrl: "https://api.telegram.org"
                                }
                            },
                            {
                                name: "Admin Email Service",
                                code: "email_admin_005",
                                description: "Main email notification channel",
                                externalService: { connect: { name: 'Email' } },
                                configuration: {
                                    emailAddress: "admin.alerts@trading-bot-domain.com"
                                }
                            },
                            {
                                name: "Discord Ops Room",
                                code: "discord_webhook_006",
                                description: "Webhook for operational logs",
                                externalService: { connect: { name: 'Discord Webhooks' } },
                                configuration: {
                                    webhookUrl: "https://discord.com/api/webhooks/1234567890/ABC_DEFG_HIJK_LMNO_PQRS_TUVW_XYZ_80chars",
                                    userName: "Trading Bot",
                                    avatarUrl: "https://example.com/bot-avatar.png"
                                }
                            },
                            {
                                name: "Slack Critical Alerts",
                                code: "slack_webhook_007",
                                description: "Slack channel for critical errors",
                                externalService: { connect: { name: 'Slack Webhooks' } },
                                configuration: {
                                    webhookUrl: "https://hooks.slack.com/services/T0000/B0000/XXXX_YYYY_ZZZZ_120_chars_long_limit",
                                    channel: "#alerts",
                                    userName: "AlertBot",
                                    iconUrl: "https://example.com/slack-icon.png"
                                }
                            },
                            {
                                name: "Twilio SMS Gateway",
                                code: "twilio_sms_008",
                                description: "Emergency SMS notifications",
                                externalService: { connect: { name: 'SMS (Twilio)' } },
                                configuration: {
                                    accountSID: "AC12345678901234567890123456789012",
                                    authToken: "auth_token_32_chars_long_1234567",
                                    fromNumber: "+1234567890",
                                    toNumber: "+9876543210",
                                    message: "Emergency Alert: Connection Lost"
                                }
                            },
                            {
                                name: "OneSignal Mobile Push",
                                code: "onesignal_push_009",
                                description: "Mobile app push notifications",
                                externalService: { connect: { name: 'Push Notifications (OneSignal)' } },
                                configuration: {
                                    appId: "550e8400-e29b-41d4-a716-446655440000",
                                    apiKey: "onesignal_api_key_40_chars_long_example",
                                    playerIds: ["user-device-uuid-1", "user-device-uuid-2"]
                                }
                            },
                            {
                                name: "WhatsApp Client Support",
                                code: "whatsapp_api_010",
                                description: "Business WhatsApp messages",
                                externalService: { connect: { name: 'WhatsApp Business API' } },
                                configuration: {
                                    phoneNumberId: "10987654321",
                                    accessToken: "whatsapp_long_access_token_v3ry_v3ry_v3ry_long_over_200_chars_to_test_db_capacity_1234567890_1234567890_1234567890_1234567890_1234567890_1234567890_1234567890_1234567890_1234567890_1234567890",
                                    recipientNumber: "+79001234567"
                                }
                            },
                            {
                                name: "Custom Data Webhook",
                                code: "generic_webhook_011",
                                description: "Generic outgoing webhook",
                                externalService: { connect: { name: 'Webhooks' } },
                                configuration: {
                                    webhookUrl: "https://my-custom-endpoint.com/v1/collect/ABC_DEFG_HIJK_LMNO_PQRS_TUVW_XYZ_80chars"
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