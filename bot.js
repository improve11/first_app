const TelegramBot = require('node-telegram-bot-api').default;
const mysql = require('mysql2/promise');
const cron = require('node-cron');

const token = '8838578840:AAHJ1EKtaTo2kE6QWb6ZgZQB6NtkIT7wc60';

const bot = new TelegramBot(token, { polling: true });

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatbottests',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

bot.onText(/\/start/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет! Я буду напоминать о себе, если ты долго не пишешь.');
});

async function updateUserLastMessage(userId) {
    try {
        const now = new Date();
        await pool.query(
            'INSERT INTO Users (id, lastMessage) VALUES (?, ?) ON DUPLICATE KEY UPDATE lastMessage = ?',
            [userId, now, now]
        );
        console.log(`User ${userId} last message updated: ${now}`);
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

bot.on('message', async (msg) => {
    const userId = msg.from.id;
    await updateUserLastMessage(userId);
});

bot.onText(/!randomitem/i, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        const [rows] = await pool.query('SELECT * FROM Items ORDER BY RAND() LIMIT 1');
        
        if (rows.length === 0) {
            bot.sendMessage(chatId, ' База данных пуста!');
            return;
        }
        
        const item = rows[0];
        const response = `(${item.id}) - ${item.name}: ${item.desc}`;
        bot.sendMessage(chatId, response);
    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, ' Ошибка при получении данных');
    }
});

cron.schedule('00 13 * * *', async () => {
    console.log('Запуск проверки пользователей...');
    
    try {
        const now = new Date();
        const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));
        
        const [users] = await pool.query(
            'SELECT id FROM Users WHERE lastMessage < ?',
            [twoDaysAgo]
        );
        
        console.log(`Найдено неактивных пользователей: ${users.length}`);
        
        for (const user of users) {
            try {
                const [items] = await pool.query('SELECT * FROM Items ORDER BY RAND() LIMIT 1');
                
                if (items.length > 0) {
                    const item = items[0];
                    const message = ` Напоминание!\n\n(${item.id}) - ${item.name}: ${item.desc}`;
                    
                    await bot.sendMessage(user.id, message);
                    console.log(`Отправлено сообщение пользователю ${user.id}`);
                }
            } catch (error) {
                console.error(`Ошибка отправки пользователю ${user.id}:`, error.message);
            }
        }
        
        console.log('Проверка завершена!');
    } catch (error) {
        console.error('Ошибка в таймере:', error);
    }
}, {
    timezone: 'Europe/Moscow' 
});

console.log('Бот запущен и готов к работе!');
console.log('Таймер настроен на проверку каждый день в 13:00 МСК');
