import configs from '../../configs/index.js';

console.log("Running...");

import TelegramBot from 'node-telegram-bot-api';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(configs.TELEGRAM_BOT_TOKEN);

export default bot;