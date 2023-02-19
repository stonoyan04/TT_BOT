const start = require('./start');
const register_book = require('./register_book');
require('dotenv').config();

async function register_commands(bot, msg) {
    const allowedChatId = process.env.ALLOWED_CHAT_ID;
    const userId = msg.from.id;
    const msgText = msg.text;
    const chatId = msg.chat.id;
    await bot.getChatMember(allowedChatId, userId)
        .then(async (chatMember) => {
            if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
                switch (msgText) {
                    case '/start':
                    case '/start@tt219_2_bot':
                        await start.start(bot, msg);
                        break;
                }
            } else {
                bot.sendMessage(chatId, 'Դու մեր խմբից չես։ 🙃')
                    .then((msg) => {
                        console.log(`Not member message sent successfully to ${msg.chat.first_name} ${msg.chat.last_name}`);
                    })
                    .catch((err) => {
                        console.log(`Error sending  not member message: ${err}`);
                    })
            }
        })
        .catch((error) => {
            console.error(`Error checking chat member status: ${error}`);
        });
}

async function register_callback (bot, query) {
    const callbackData = query.data;

    switch (callbackData) {
        case 'register_book':
            await register_book.register_book(bot, query);
            break;
        case 'about_me':
            await register_book.about_me(bot, query);
            break;
        case 'my_group':
            await register_book.my_group(bot, query);
            break;
        case 'my_lab_group':
            await register_book.my_lab_group(bot, query);
            break;
        case 'my_eng_group':
            await register_book.my_eng_group(bot, query);
            break;
        case 'my_rus_group':
            await register_book.my_rus_group(bot, query);
            break;
        case 'back_to_register_book':
            await register_book.register_book(bot, query);
            break;
        case 'back_to_start':
            await start.back_to_start(bot, query);
            break;
    }
}

module.exports = {
  register_commands,
  register_callback
};