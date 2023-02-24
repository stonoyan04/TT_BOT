const start = require('./start');
const register_book = require('./register_book');
const timetable = require('./timetable');

async function register_commands(bot, msg) {
    if(msg.from.is_bot) return;
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
                        } else {
                            await start.start(bot, msg);
                        }
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

async function register_callback (bot, query, client) {
    const callbackData = query.data;

    switch (callbackData) {
        case 'register_book':
            await register_book.register_book(bot, query);
            break;
        case 'about_me':
            await register_book.about_me(bot, query, client);
            break;
        case 'my_group':
            await register_book.my_group(bot, query, client);
            break;
        case 'my_lab_group':
            await register_book.my_lab_group(bot, query, client);
            break;
        case 'my_eng_group':
            await register_book.my_eng_group(bot, query, client);
            break;
        case 'my_rus_group':
            await register_book.my_rus_group(bot, query, client);
            break;
        case 'back_to_register_book':
            await register_book.register_book(bot, query);
            break;
        case 'back_to_start':
            await start.back_to_start(bot, query);
            break;
        case 'timetable':
        case 'back_to_timetable':
            await timetable.timetable(bot, query);
            break;
        case 'timetable_today':
            await timetable.today(bot, query, client);
            break;
        case 'timetable_tomorrow':
            await timetable.tomorrow(bot, query, client);
            break;
        case 'timetable_numerator':
            await timetable.numerator(bot, query, client);
            break;
        case 'timetable_denominator':
            await timetable.denominator(bot, query, client);
            break;
    }
}

module.exports = {
  register_commands,
  register_callback
};