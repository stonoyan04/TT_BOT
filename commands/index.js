const start = require('./start');
require('dotenv').config();

module.exports = {
    register: function (bot, msg) {
        const allowedChatId = process.env.ALLOED_CHAT_ID;
        const userId = msg.from.id;
        const msgText = msg.text;
        const chatId = msg.chat.id;
        bot.getChatMember(allowedChatId, userId)
            .then((chatMember) => {
                if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
                    switch (msgText) {
                        case '/start':
                            start(bot, msg);
                            break;
                    }
                } else {
                    bot.sendMessage(chatId, 'You are not a member of this supergroup.')
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
};
