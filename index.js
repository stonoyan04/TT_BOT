require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const commands = require('./commands');

const token = process.env.TELEGRAM_BOT_API_TOKEN;

try {
    const bot = new TelegramBot(token, { polling: true });
    bot.on('message', (msg) => {
        commands.register(bot, msg);
    });
    console.log('TT bot has started');
} catch (error) {
    console.error(`Error starting TT bot: ${error}`);
}
