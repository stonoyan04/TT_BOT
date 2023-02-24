require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const commands = require('./commands');
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true });
const token = process.env.TELEGRAM_BOT_API_TOKEN;

client.connect()
    .then(() => {
        console.log('Connected to MongoDB database');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB database:', err);
        process.exit(1);
    });

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
        await commands.register_commands(bot, msg);
    });

    bot.on('callback_query', async (query) => {
        await commands.register_callback(bot, query, client);
    });

    console.log('TT bot has started');

    process.on('SIGINT', () => {
        client.close()
            .then(() => {
                console.log('MongoDB connection disconnected through app termination');
                process.exit(0);
            })
            .catch((err) => {
                console.error('Error disconnecting from MongoDB database:', err);
                process.exit(1);
            });
    });

    process.on('SIGTERM', () => {
        client.close()
            .then(() => {
                console.log('MongoDB connection disconnected through app termination');
                process.exit(0);
            })
            .catch((err) => {
                console.error('Error disconnecting from MongoDB database:', err);
                process.exit(1);
            });
    });
} catch (error) {
    console.error(`Error starting TT bot: ${error}`);
}

