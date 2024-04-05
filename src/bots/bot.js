const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })

console.log("Running...");

const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

module.exports = bot;