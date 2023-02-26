async function start (bot, msg) {
    const chatId = msg.from.id;
    const username = msg.from.username;
    await bot.sendMessage(chatId, 'Ես ՏՏ 219 բոտն եմ։Իմ հրամանները իմանալու համար գրիր /start և սեղմիր հրամանների մասին կոճակին: Հույս ունենամ՝ մի բանով կկարողանամ օգնել քեզ 😀։ \n\n Հարցերի դեպքում @stonoyan04 :\n\n Հ․ Գ․ բոտը ստեղծողը 100500 տարվա փորձով Senior չի և քննադատելուց առաջ հիշեք դրա մասին! Բոտի կոդը կարողեք տեսնել <a href="https://github.com/stonoyan04/TT_BOT">այստեղ</a>:', {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Դասացուցակ ', callback_data: 'timetable'}],
                [{text: 'Մատյան ', callback_data: 'register_book'}],
                [{text: 'Գրականություն ', callback_data: 'literature'}],
                [{text: 'Հրամանների մասին', callback_data: 'info'}]
            ]
        }
    })
        .then(() => {
            console.log(`${username} used start command!`);
        })
        .catch((error) => {
            console.error(`Error sending start message to ${username}: ${error}`);
        });
}

async function back_to_start (bot, query) {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    await bot.editMessageText('Ես ՏՏ 219 բոտն եմ։Իմ հրամանները իմանալու համար գրիր /start և սեղմիր հրամանների մասին կոճակին: Հույս ունենամ՝ մի բանով կկարողանամ օգնել քեզ 😀։ \n\n Հարցերի դեպքում @stonoyan04 :\n\n Հ․ Գ․ բոտը ստեղծողը 100500 տարվա փորձով Senior չի և քննադատելուց առաջ հիշեք դրա մասին! Բոտի կոդը կարողեք տեսնել <a href="https://github.com/stonoyan04/TT_BOT">այստեղ</a>:', {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Դասացուցակ ', callback_data: 'timetable'}],
                [{text: 'Մատյան ', callback_data: 'register_book'}],
                [{text: 'Գրականություն ', callback_data: 'literature'}],
                [{text: 'Հրամանների մասին', callback_data: 'info'}]
            ]
        }
    })
        .then(function() {
            console.log(`Message ${messageId} edited in chat ${chatId}.`);
        })
        .catch(function(error) {
            console.error(`Error editing message ${messageId} in chat ${chatId}: ${error}`);
        });
}

async function info(bot, query) {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    await bot.editMessageText(`Բոտը իր աշխատանքը սկսում է /start հրամանից և հետո բոլոր հրամանները դառնում են կոճակով: \n\n Դասացուցակ բաժնում կարողեք տեսնել դասացուցակը(տվյալ օրվանը,հաջորդ օրվանը, համարիչ կամ հայտարար շաբաթվա)։ \n\n Մատյան բաժնում կարողեք տեսնել ձեր խմբի համարը և անդամներին։ \n\nԳրականություն բաժնում կարողեք գտնել տարբեր գրքեր կամ դասախոսություններ։  \n\n Բոլոր առաջարկների, բողոքների կամ այլ հարցերի դեպքում գրեք @stonoyan04 ։`, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Հետ', callback_data: 'back_to_start'}]
            ]
        }
    })
        .then(function () {
            console.log(`Message ${messageId} edited in chat ${chatId}.`);
        })
        .catch(function (error) {
            console.error(`Error editing message ${messageId} in chat ${chatId}: ${error}`);
        });
}

async function literature (bot, query) {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    await bot.editMessageText('Սեղմիր <a href="https://drive.google.com/drive/folders/1hSayav8M8EfowjN1cfoA6dUmp70PI8lY">այստեղ</a>:', {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Հետ', callback_data: 'back_to_start'}]

            ]
        }
    })
        .then(function() {
            console.log(`Message ${messageId} edited in chat ${chatId}.`);
        })
        .catch(function(error) {
            console.error(`Error editing message ${messageId} in chat ${chatId}: ${error}`);
        });
}

module.exports = {
    start,
    back_to_start,
    info,
    literature
};