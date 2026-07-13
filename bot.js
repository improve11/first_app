const TelegramBot = require('node-telegram-bot-api').default;

const token = '8838578840:AAHJ1EKtaTo2kE6QWb6ZgZQB6NtkIT7wc60';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон!!!');
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpText = `
📋 Список команд:
/site - отправляет ссылку на сайт Октагона
/creator - показывает создателя бота
    `;
    bot.sendMessage(chatId, helpText);
});

bot.onText(/\/site/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'https://octagon-students.ru');
});

bot.onText(/\/creator/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bashirov Ivan Andreevich IC 1-23-2'); 
});

console.log('Бот запущен и готов к работе!');
