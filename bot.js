const TelegramBot = require('node-telegram-bot-api').default;

const token = '8838578840:AAHJ1EKtaTo2kE6QWb6ZgZQB6NtkIT7wc60';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон!');
});

console.log('Бот запущен и готов к работе!');
