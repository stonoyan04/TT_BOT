require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const commands = require('./commands');

const token = process.env.TELEGRAM_BOT_API_TOKEN;
try {
    const bot = new TelegramBot(token, { polling: true });

    bot.setMyCommands([
        {command: '/start', description: 'Սկիզբ։'},
    ])
        .then(() => {
            console.log(`Slash commands ready!`);
        })
        .catch((error) => {
            console.error(`Error setting commands`, error);
        });


    bot.on('message', async (msg) => {
        if(msg.from.is_bot) return;
        if(msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
            await bot.deleteMessage(msg.chat.id, msg.message_id);
            await bot.sendMessage(msg.from.id, "Բոտը աշխատում է միայն անձնական նամակներով t.me/tt219_2_bot")
                .then(() => {
                    console.log(`${msg.from.username} used start command!`);
                })
                .catch((error) => {
                    console.error(`Error sending  message to ${msg.from.username}: ${error}`);
                });
            return;
        }
        await commands.register_commands(bot, msg);
    });

    bot.on('callback_query', async (query) => {
        await commands.register_callback(bot, query);
    });

    console.log('TT bot has started');
} catch (error) {
    console.error(`Error starting TT bot: ${error}`);
}
