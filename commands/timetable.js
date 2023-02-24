async function timetable(bot, query) {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    await bot.editMessageText('Ըտրիր տարբերակներից մեկը 👇 \n\n Հ․ Գ․ այս հրամանների մշակումը կարող է սովորականից երկար տևել։', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Այսօրվա դասացուցակը', callback_data: 'timetable_today'}],
                [{text: 'Վաղվա դասացուցակը', callback_data: 'timetable_tomorrow'}],
                [{text: 'Համարիչ դասացուցակ', callback_data: 'timetable_numerator'}],
                [{text: 'Հայտարար դասացուցակ', callback_data: 'timetable_denominator'}],
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

async function today (bot, query, client) {
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const now = new Date();
    const offset = 4;
    const gmt4Date = new Date(now.getTime() + offset * 60 * 60 * 1000);
    const start = new Date('February 6, 2023');
    const days = Math.floor((gmt4Date - start) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil(days / 7);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysOfWeek_arm = ['Կիրակի', 'Երկուշաբթի', 'Երեքշաբթի', 'Չորեքշաբտի', 'Հինգշաբթի', 'Ուրբաթ', 'Շաբաթ'];
    const dayOfWeek = daysOfWeek[gmt4Date.getUTCDay()];
    const dayOfWeek_arm = daysOfWeek_arm[gmt4Date.getUTCDay()];


    if (dayOfWeek == 'Saturday' || dayOfWeek == 'Sunday') {
        await bot.editMessageText(`Այսօր հանգստյան օր է 😉:`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Վաղվա դասացուցակը', callback_data: 'timetable_tomorrow'}],
                    [{text: 'Համարիչ դասացուցակ', callback_data: 'timetable_numerator'}],
                    [{text: 'Հայտարար դասացուցակ', callback_data: 'timetable_denominator'}],
                    [{ text: 'Հետ', callback_data: 'back_to_timetable' }]
                ]
            }
        })
            .then(function() {
                console.log(`Message ${messageId} edited in chat ${chatId}.`);
            })
            .catch(function(error) {
                console.error(`Error editing message ${messageId} in chat ${chatId}: ${error}`);
            });
    } else {
        if (weekNumber % 2 != 0) {
            try {
                const result = await client
                    .db(process.env.DB_NAME)
                    .collection('register_book')
                    .findOne({ id: userId });
                const user =  JSON.parse(JSON.stringify(result));
                const _result = await client
                    .db(process.env.DB_NAME)
                    .collection('timetable')
                    .findOne({id: 'timetable'});
                const timetable = JSON.parse(JSON.stringify(_result));
                const first = timetable.numerator[dayOfWeek]['1'].all || timetable.numerator[dayOfWeek]['1'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['1'].lab[`${user.lab_number}`];
                const second = timetable.numerator[dayOfWeek]['2'].all || timetable.numerator[dayOfWeek]['2'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['2'].lab[`${user.lab_number}`];
                const third = timetable.numerator[dayOfWeek]['3'].all || timetable.numerator[dayOfWeek]['3'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['3'].lab[`${user.lab_number}`];
                const fourth = timetable.numerator[dayOfWeek]['4'].all || timetable.numerator[dayOfWeek]['4'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['4'].lab[`${user.lab_number}`];

                await bot.editMessageText(`${dayOfWeek_arm} - Համարիչ \n\n1. ${first}\n2. ${second}\n3. ${third}\n4. ${fourth}`, {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Վաղվա դասացուցակը', callback_data: 'timetable_tomorrow'}],
                            [{text: 'Համարիչ դասացուցակ', callback_data: 'timetable_numerator'}],
                            [{text: 'Հայտարար դասացուցակ', callback_data: 'timetable_denominator'}],
                            [{ text: 'Հետ', callback_data: 'back_to_timetable' }]
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
                console.log(`Error retrieving timetable: ${error}`);
            }
        } else {
            const result = await client
                .db(process.env.DB_NAME)
                .collection('register_book')
                .findOne({id: userId});
            const user = JSON.parse(JSON.stringify(result));
            const _result = await client
                .db(process.env.DB_NAME)
                .collection('timetable')
                .findOne({id: 'timetable'});
            const timetable = JSON.parse(JSON.stringify(_result));
            const first = timetable.denominator[dayOfWeek]['1'].all || timetable.denominator[dayOfWeek]['1'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['1'].lab[`${user.lab_number}`];
            const second = timetable.denominator[dayOfWeek]['2'].all || timetable.denominator[dayOfWeek]['2'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['2'].lab[`${user.lab_number}`];
            const third = timetable.denominator[dayOfWeek]['3'].all || timetable.denominator[dayOfWeek]['3'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['3'].lab[`${user.lab_number}`];
            const fourth = timetable.denominator[dayOfWeek]['4'].all || timetable.denominator[dayOfWeek]['4'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['4'].lab[`${user.lab_number}`];

            await bot.editMessageText(`${dayOfWeek_arm} - Հայտարար \n\n1. ${first}\n2. ${second}\n3. ${third}\n4. ${fourth}`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Այսօրվա դասացուցակը', callback_data: 'timetable_today'}],
                        [{text: 'Համարիչ դասացուցակ', callback_data: 'timetable_numerator'}],
                        [{text: 'Հայտարար դասացուցակ', callback_data: 'timetable_numerator'}],
                        [{text: 'Հետ', callback_data: 'back_to_timetable'}]
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
    }
}

async function tomorrow (bot, query, client) {
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const now = new Date();
    const offset = 4;
    const gmt4Date = new Date(now.getTime() + offset * 60 * 60 * 1000);
    const start = new Date('February 6, 2023');
    const days = Math.floor((gmt4Date - start) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil(days / 7);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysOfWeek_arm = ['Կիրակի', 'Երկուշաբթի', 'Երեքշաբթի', 'Չորեքշաբտի', 'Հինգշաբթի', 'Ուրբաթ', 'Շաբաթ'];
    const dayOfWeek = daysOfWeek[gmt4Date.getUTCDay()+1];
    const dayOfWeek_arm = daysOfWeek_arm[gmt4Date.getUTCDay()+1];


    if (dayOfWeek == 'Saturday' || dayOfWeek == 'Sunday') {
        await bot.editMessageText(`Վաղը հանգստյան օր է 😉:`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Այսօրվա դասացուցակը', callback_data: 'timetable_today'}],
                    [{text: 'Համարիչ դասացուցակ', callback_data: 'timetable_numerator'}],
                    [{text: 'Հայտարար դասացուցակ', callback_data: 'timetable_denominator'}],
                    [{ text: 'Հետ', callback_data: 'back_to_timetable' }]
                ]
            }
        })
            .then(function() {
                console.log(`Message ${messageId} edited in chat ${chatId}.`);
            })
            .catch(function(error) {
                console.error(`Error editing message ${messageId} in chat ${chatId}: ${error}`);
            });
    } else {
        if (weekNumber % 2 != 0) {
            try {
                const result = await client
                    .db(process.env.DB_NAME)
                    .collection('register_book')
                    .findOne({ id: userId });
                const user =  JSON.parse(JSON.stringify(result));
                const _result = await client
                    .db(process.env.DB_NAME)
                    .collection('timetable')
                    .findOne({id: 'timetable'});
                const timetable = JSON.parse(JSON.stringify(_result));
                const first = timetable.numerator[dayOfWeek]['1'].all || timetable.numerator[dayOfWeek]['1'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['1'].lab[`${user.lab_number}`];
                const second = timetable.numerator[dayOfWeek]['2'].all || timetable.numerator[dayOfWeek]['2'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['2'].lab[`${user.lab_number}`];
                const third = timetable.numerator[dayOfWeek]['3'].all || timetable.numerator[dayOfWeek]['3'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['3'].lab[`${user.lab_number}`];
                const fourth = timetable.numerator[dayOfWeek]['4'].all || timetable.numerator[dayOfWeek]['4'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['4'].lab[`${user.lab_number}`];

                await bot.editMessageText(`${dayOfWeek_arm} - Համարիչ \n\n1. ${first}\n2. ${second}\n3. ${third}\n4. ${fourth}`, {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Այսօրվա դասացուցակը', callback_data: 'timetable_today'}],
                            [{text: 'Համարիչ դասացուցակ', callback_data: 'timetable_numerator'}],
                            [{text: 'Հայտարար դասացուցակ', callback_data: 'timetable_denominator'}],
                            [{ text: 'Հետ', callback_data: 'back_to_timetable' }]
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
                console.log(`Error retrieving timetable: ${error}`);
            }
        } else {
            const result = await client
                .db(process.env.DB_NAME)
                .collection('register_book')
                .findOne({id: userId});
            const user = JSON.parse(JSON.stringify(result));
            const _result = await client
                .db(process.env.DB_NAME)
                .collection('timetable')
                .findOne({id: 'timetable'});
            const timetable = JSON.parse(JSON.stringify(_result));
            const first = timetable.denominator[dayOfWeek]['1'].all || timetable.denominator[dayOfWeek]['1'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['1'].lab[`${user.lab_number}`];
            const second = timetable.denominator[dayOfWeek]['2'].all || timetable.denominator[dayOfWeek]['2'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['2'].lab[`${user.lab_number}`];
            const third = timetable.denominator[dayOfWeek]['3'].all || timetable.denominator[dayOfWeek]['3'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['3'].lab[`${user.lab_number}`];
            const fourth = timetable.denominator[dayOfWeek]['4'].all || timetable.denominator[dayOfWeek]['4'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['4'].lab[`${user.lab_number}`];

            await bot.editMessageText(`${dayOfWeek_arm} - Հայտարար \n\n1. ${first}\n2. ${second}\n3. ${third}\n4. ${fourth}`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Այսօրվա դասացուցակը', callback_data: 'timetable_today'}],
                        [{text: 'Համարիչ դասացուցակ', callback_data: 'timetable_numerator'}],
                        [{text: 'Հայտարար դասացուցակ', callback_data: 'timetable_numerator'}],
                        [{text: 'Հետ', callback_data: 'back_to_timetable'}]
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
    }
}

async function numerator (bot, query, client) {
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const daysOfWeek_arm = ['Երկուշաբթի', 'Երեքշաբթի', 'Չորեքշաբտի', 'Հինգշաբթի', 'Ուրբաթ'];
    const result = await client
        .db(process.env.DB_NAME)
        .collection('register_book')
        .findOne({ id: userId });
    const user =  JSON.parse(JSON.stringify(result));
    const _result = await client
        .db(process.env.DB_NAME)
        .collection('timetable')
        .findOne({id: 'timetable'});
    const timetable = JSON.parse(JSON.stringify(_result));
    let timetable_numerator = '';

    for (let i = 0; i < daysOfWeek.length; i++) {
        const dayOfWeek = daysOfWeek[i];
        const dayOfWeek_arm = daysOfWeek_arm[i];
        const first = timetable.numerator[dayOfWeek]['1'].all || timetable.numerator[dayOfWeek]['1'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['1'].lab[`${user.lab_number}`];
        const second = timetable.numerator[dayOfWeek]['2'].all || timetable.numerator[dayOfWeek]['2'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['2'].lab[`${user.lab_number}`];
        const third = timetable.numerator[dayOfWeek]['3'].all || timetable.numerator[dayOfWeek]['3'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['3'].lab[`${user.lab_number}`];
        const fourth = timetable.numerator[dayOfWeek]['4'].all || timetable.numerator[dayOfWeek]['4'].group[`${user.group_number}`] || timetable.numerator[dayOfWeek]['4'].lab[`${user.lab_number}`];
        timetable_numerator += `\n\n${dayOfWeek_arm} - Համարիչ \n1. ${first}\n2. ${second}\n3. ${third}\n4. ${fourth}`;
    }
    await bot.editMessageText(timetable_numerator, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Այսօրվա դասացուցակը', callback_data: 'timetable_today'}],
                [{text: 'Վաղվա դասացուցակը', callback_data: 'timetable_tomorrow'}],
                [{text: 'Հայտարար դասացուցակ', callback_data: 'timetable_denominator'}],
                [{ text: 'Հետ', callback_data: 'back_to_timetable' }]
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


async function denominator (bot, query, client) {
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const daysOfWeek_arm = ['Երկուշաբթի', 'Երեքշաբթի', 'Չորեքշաբտի', 'Հինգշաբթի', 'Ուրբաթ'];
    const result = await client
        .db(process.env.DB_NAME)
        .collection('register_book')
        .findOne({ id: userId });
    const user =  JSON.parse(JSON.stringify(result));
    const _result = await client
        .db(process.env.DB_NAME)
        .collection('timetable')
        .findOne({id: 'timetable'});
    const timetable = JSON.parse(JSON.stringify(_result));
    let timetable_numerator = '';

    for (let i = 0; i < daysOfWeek.length; i++) {
        const dayOfWeek = daysOfWeek[i];
        const dayOfWeek_arm = daysOfWeek_arm[i];
        const first = timetable.denominator[dayOfWeek]['1'].all || timetable.denominator[dayOfWeek]['1'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['1'].lab[`${user.lab_number}`];
        const second = timetable.denominator[dayOfWeek]['2'].all || timetable.denominator[dayOfWeek]['2'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['2'].lab[`${user.lab_number}`];
        const third = timetable.denominator[dayOfWeek]['3'].all || timetable.denominator[dayOfWeek]['3'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['3'].lab[`${user.lab_number}`];
        const fourth = timetable.denominator[dayOfWeek]['4'].all || timetable.denominator[dayOfWeek]['4'].group[`${user.group_number}`] || timetable.denominator[dayOfWeek]['4'].lab[`${user.lab_number}`];
        timetable_numerator += `\n\n${dayOfWeek_arm} - Հայտարար \n1. ${first}\n2. ${second}\n3. ${third}\n4. ${fourth}`;
    }
    await bot.editMessageText(timetable_numerator, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
            inline_keyboard: [
                [{text: 'Այսօրվա դասացուցակը', callback_data: 'timetable_today'}],
                [{text: 'Վաղվա դասացուցակը', callback_data: 'timetable_tomorrow'}],
                [{text: 'Համարիչ դասացուցակ', callback_data: 'timetable_numerator'}],
                [{ text: 'Հետ', callback_data: 'back_to_timetable' }]
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
    timetable,
    today,
    tomorrow,
    numerator,
    denominator
};