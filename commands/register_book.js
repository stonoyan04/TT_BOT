async function register_book (bot, query) {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    await bot.editMessageText('Ըտրիր տարբերակներից մեկը 👇', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Իմ մասին', callback_data: 'about_me' }],
                [{ text: 'Իմ խումբը', callback_data: 'my_group' }],
                [{ text: 'Իմ լաբ․ խումբը', callback_data: 'my_lab_group' }],
                [{ text: 'Իմ անգլերենի խումբը', callback_data: 'my_eng_group' }],
                [{ text: 'Իմ ռուսաց լեզվի խումբը', callback_data: 'my_rus_group' }],
                [{ text: 'Հետ', callback_data: 'back_to_start' }]
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

async function about_me (bot, query) {
    require('dotenv').config();
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true });
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
        await client.connect();
        const result = await client
            .db(process.env.DB_NAME)
            .collection('register_book')
            .findOne({ id: userId });
        const user =  JSON.parse(JSON.stringify(result));
        await bot.editMessageText(`${user.name} \n\nԽումբ ֊ ${user.group_number} \nՄատյանի համար ֊ ${user.book_number} \nԼաբ․ խումբ ֊ ${user.lab_number} \nԱնգլերենի խումբ ֊ ${user.lang_number} \nՌուսաց լեզվի խումբ ֊ ${user.hasOwnProperty('_lang_number') ? user._lang_number : user.lang_number}`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Իմ խումբը', callback_data: 'my_group' }],
                    [{ text: 'Իմ լաբ․ խումբը', callback_data: 'my_lab_group' }],
                    [{ text: 'Իմ անգլերենի խումբը', callback_data: 'my_eng_group' }],
                    [{ text: 'Իմ ռուսաց լեզվի խումբը', callback_data: 'my_rus_group' }],
                    [{ text: 'Հետ', callback_data: 'back_to_register_book' }]
                ]
            }
        })
            .then(function() {
                console.log(`Message ${messageId} edited in chat ${chatId}.`);
            })
            .catch(function(error) {
                console.error(`Error editing message ${messageId} in chat ${chatId}: ${error}`);
            });
    } catch (error) {
        console.log(`Error retrieving user information: ${error}`);
    } finally {
        await client.close();
    }
}

async function my_group(bot, query) {
    require('dotenv').config();
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true });
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
        await client.connect();
        const result = await client
            .db(process.env.DB_NAME)
            .collection('register_book')
            .findOne({ id: userId });
        const user =  JSON.parse(JSON.stringify(result));
        const users = await client
            .db(process.env.DB_NAME)
            .collection('register_book')
            .find({ group_number: user.group_number })
            .toArray();
        const userNames = users
            .map(u => u.name)
            .join('\n');
        await bot.editMessageText(`Խումբ - ${user.group_number} \n${userNames}`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Իմ մասին', callback_data: 'about_me' }],
                    [{ text: 'Իմ լաբ․ խումբը', callback_data: 'my_lab_group' }],
                    [{ text: 'Իմ անգլերենի խումբը', callback_data: 'my_eng_group' }],
                    [{ text: 'Իմ ռուսաց լեզվի խումբը', callback_data: 'my_rus_group' }],
                    [{ text: 'Հետ', callback_data: 'back_to_register_book' }]
                ]
            }
        });
    } catch (error) {
        console.log(`Error retrieving users: ${error}`);
    } finally {
        await client.close();
    }
}

async function my_lab_group(bot, query) {
    require('dotenv').config();
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true });
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
        await client.connect();
        const result = await client
            .db(process.env.DB_NAME)
            .collection('register_book')
            .findOne({ id: userId });
        const user =  JSON.parse(JSON.stringify(result));
        const users = await client
            .db(process.env.DB_NAME)
            .collection('register_book')
            .find({ lab_number: user.lab_number})
            .toArray();
        const userNames = users
            .map(u => u.name)
            .join('\n');
        await bot.editMessageText(`Լաբ. խումբ - ${user.lab_number} \n${userNames}`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Իմ մասին', callback_data: 'about_me' }],
                    [{ text: 'Իմ խումբը', callback_data: 'my_group' }],
                    [{ text: 'Իմ անգլերենի խումբը', callback_data: 'my_eng_group' }],
                    [{ text: 'Իմ ռուսաց լեզվի խումբը', callback_data: 'my_rus_group' }],
                    [{ text: 'Հետ', callback_data: 'back_to_register_book' }]
                ]
            }
        });
    } catch (error) {
        console.log(`Error retrieving users: ${error}`);
    } finally {
        await client.close();
    }
}

async function my_eng_group(bot, query) {
    require('dotenv').config();
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true });
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
        await client.connect();
        const result = await client
            .db(process.env.DB_NAME)
            .collection('register_book')
            .findOne({ id: userId });
        const user =  JSON.parse(JSON.stringify(result));
        const users = await client
            .db(process.env.DB_NAME)
            .collection('register_book')
            .find({ lang_number: user.lang_number})
            .toArray();
        const userNames = users
            .map(u => u.name)
            .join('\n');
        await bot.editMessageText(`Անգլերենի խումբ - ${user.lang_number} \n${userNames}`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Իմ մասին', callback_data: 'about_me' }],
                    [{ text: 'Իմ խումբը', callback_data: 'my_group' }],
                    [{ text: 'Իմ լաբ․ խումբը', callback_data: 'my_lab_group' }],
                    [{ text: 'Իմ ռուսաց լեզվի խումբը', callback_data: 'my_rus_group' }],
                    [{ text: 'Հետ', callback_data: 'back_to_register_book' }]
                ]
            }
        });
    } catch (error) {
        console.log(`Error retrieving users: ${error}`);
    } finally {
        await client.close();
    }
}

async function my_rus_group(bot, query) {
    require('dotenv').config();
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true });
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
        await client.connect();
        const result = await client
            .db(process.env.DB_NAME)
            .collection('register_book')
            .findOne({ id: userId });
        const user = JSON.parse(JSON.stringify(result));
        const langNumber = user._lang_number ? user._lang_number : user.lang_number;
        const users = await client
            .db(process.env.DB_NAME)
            .collection('register_book')
            .find({ lang_number: langNumber })
            .toArray();
        const userNames = users
            .map(u => u.name)
            .join('\n');
        await bot.editMessageText(`Ռուսաց լեզվի խումբ - ${langNumber} \n${userNames}`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Իմ մասին', callback_data: 'about_me' }],
                    [{ text: 'Իմ խումբը', callback_data: 'my_group' }],
                    [{ text: 'Իմ լաբ․ խումբը', callback_data: 'my_lab_group' }],
                    [{ text: 'Իմ անգլերենի խումբը', callback_data: 'my_eng_group' }],
                    [{ text: 'Հետ', callback_data: 'back_to_register_book' }]
                ]
            }
        });
    } catch (error) {
        console.log(`Error retrieving users: ${error}`);
    } finally {
        await client.close();
    }
}


module.exports = {
    register_book,
    about_me,
    my_group,
    my_lab_group,
    my_eng_group,
    my_rus_group
};