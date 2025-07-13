import TelegramBot from 'node-telegram-bot-api';
import renderMessage from '../../utils/render-message.util'

/**
 * Sends a message to a Telegram chat using the specified bot configuration.
 * 
 * This function creates a temporary Telegram bot instance, sends the rendered message,
 * and then stops the bot polling to clean up resources. The message can include
 * template variables that will be rendered using the heap and sequence context.
 * Method has access to the heap and sequenceContext and settings
 * // TODO should remove bot instance creation, because we don't need to receive messages, just send some info
 * 
 * @param args - Object containing the message parameters
 * @param args.botId - Optional bot ID to use specific bot settings. If not provided, uses the first bot in settings
 * @param args.message - The message text to send. Can include template variables like {{variable}}
 * @param param1 - Object containing execution context
 * @param param1.sequenceContext - Context object for the current sequence execution
 * @param settings - Global settings object containing Telegram bot configurations
 * @param settings.telegramSettings - Array of Telegram bot settings objects
 * @param settings.telegramSettings[].botId - Unique identifier for the bot
 * @param settings.telegramSettings[].apiToken - Telegram Bot API token
 * @param settings.telegramSettings[].chatId - Target chat ID where message will be sent
 * 
 * @example
 * Action to send a message to a telegram chat
{
    "type": "telegram_send_message",
    "arguments": {
        "botId": "main_bot",
        "message": "The price of BTC is ${__heap__.binance_um_futures_get_ticker.MYXUSDT.[0]}"
    }
}
 */
export default function telegram_send_message (
    args: any, 
    {
        sequenceContext
    },
    settings
) {
    const { botId, message } = args;
    const { telegramSettings } = settings;

    let settingsToUse;
    if(!botId) {
        settingsToUse = telegramSettings[0];
    } else {
        settingsToUse = telegramSettings.find((setting: any) => setting.botId === botId);
    }

    const { apiToken, chatId } = settingsToUse;
    
    // TODO: remove pooling we don't need to receive messages, just send some info
    const bot = new TelegramBot(apiToken, { polling: true });
    const messageToSend = renderMessage(message, { heap: this.heap, sequenceContext });
    bot.sendMessage(chatId, messageToSend);
    bot.stopPolling();
};