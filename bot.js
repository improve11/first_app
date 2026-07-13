const TelegramBot = require('node-telegram-bot-api').default;
const mysql = require('mysql2/promise');

const token = '8838578840:AAHJ1EKtaTo2kE6QWb6ZgZQB6NtkIT7wc60';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatbottests',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон! Напиши /help чтобы увидеть список команд.');
});

bot.onText(/\/help/i, (msg) => {
    const chatId = msg.chat.id;
    const helpText = `
📋 Список команд:
/site - сайт Октагона
/creator - создатель бота
/randomitem - случайный предмет
/getitembyid ID - найти предмет по ID
/deleteitem ID - удалить предмет
    `;
    bot.sendMessage(chatId, helpText);
});

bot.onText(/\/site/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'https://octagon-students.ru');
});

bot.onText(/\/creator/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bashirov Ivan Andreevich IS 1-23-2');
});

bot.onText(/\/randomitem/i, async (msg) => {
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

bot.onText(/\/getitembyid\s+(\d+)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const id = parseInt(match[1]);
    
    try {
        const [rows] = await pool.query('SELECT * FROM Items WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            bot.sendMessage(chatId, ' Предмет не найден!');
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

bot.onText(/\/deleteitem\s+(\d+)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const id = parseInt(match[1]);
    
    try {
        const [result] = await pool.query('DELETE FROM Items WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            bot.sendMessage(chatId, ' Ошибка: предмет не найден');
            return;
        }
        
        bot.sendMessage(chatId, ' Предмет успешно удалён!');
    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, ' Ошибка при удалении');
    }
});

console.log('Бот запущен и готов к работе!');
