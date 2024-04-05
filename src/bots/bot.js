const TelegramBot = require('node-telegram-bot-api');

console.log("process.env.TELEGRAM_BOT_TOKEN=", process.env.TELEGRAM_BOT_TOKEN)

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

module.exports = bot;