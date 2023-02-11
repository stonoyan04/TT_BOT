module.exports = function (bot, msg) {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    bot.sendMessage(chatId, 'Hello! How can I help you?')
        .then(() => {
            console.log(`${username} used start command!`);
        })
        .catch((error) => {
            console.error(`Error sending start message to ${username}: ${error}`);
        });
};
