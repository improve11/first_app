const TelegramBot = require('node-telegram-bot-api').default;
const axios = require('axios');

const token = '8838578840:AAHJ1EKtaTo2kE6QWb6ZgZQB6NtkIT7wc60';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон!\nДоступные команды:\n!qr текст - создать QR-код\n!webscr https://site.com - скриншот сайта');
});

bot.onText(/!qr\s+(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];
    
    try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
        
        const response = await axios.get(qrUrl, { responseType: 'arraybuffer' });
        
        bot.sendPhoto(chatId, response.data, {
            caption: `QR-код для: ${text}`
        });
    } catch (error) {
        console.error('QR Error:', error);
        bot.sendMessage(chatId, ' Ошибка при генерации QR-кода');
    }
});

bot.onText(/!webscr\s+(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    let url = match[1].trim();
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    try {
        const screenshotUrl = `https://image.thum.io/get/width/1280/crop/768/${url}`;
        
        console.log('Загружаю скриншот:', screenshotUrl);
        
        const response = await axios.get(screenshotUrl, { 
            responseType: 'arraybuffer',
            timeout: 60000, 
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log('Скриншот загружен, размер:', response.data.length);
        
        await bot.sendPhoto(chatId, response.data, {
            caption: `📸 Скриншот: ${url}`
        });
        
        console.log('Скриншот отправлен!');
    } catch (error) {
        console.error('Screenshot Error:', error.message);
        bot.sendMessage(chatId, ' Ошибка при создании скриншота. Попробуйте другой сайт.');
    }
});

console.log('Бот запущен и готов к работе!');
