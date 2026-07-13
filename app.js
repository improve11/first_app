const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatbottests',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', (req, res) => {
  res.send('<h1>Привет, Октагон!!!</h1>');
});

app.get('/static', (req, res) => {
  res.json({
    header: "Hello",
    body: "Octagon NodeJS Test"
  });
});

app.get('/dynamic', (req, res) => {
  const { a, b, c } = req.query;
  
  if (!a || !b || !c || isNaN(a) || isNaN(b) || isNaN(c)) {
    return res.json({ header: "Error" });
  }
  
  const result = (a * b * c) / 3;
  
  res.json({
    header: "Calculated",
    body: result.toString()
  });
});

app.get('/getAllItems', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Items');
    res.json(rows);
  } catch (error) {
    console.error('getAllItems error:', error);
    res.json(null);
  }
});

app.post('/addItem', async (req, res) => {
  try {
    const { name, desc } = req.query;
    
    if (!name || !desc) {
      return res.json(null);
    }
    
    const [result] = await pool.query(
      'INSERT INTO Items (name, `desc`) VALUES (?, ?)',  
      [name, desc]
    );
    
    const [newItem] = await pool.query(
      'SELECT * FROM Items WHERE id = ?',
      [result.insertId]
    );
    
    res.json(newItem[0]);
  } catch (error) {
    console.error('addItem error:', error);
    res.json(null);
  }
});

app.post('/deleteItem', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id || isNaN(id)) {
      return res.json(null);
    }
    
    const [result] = await pool.query(
      'DELETE FROM Items WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.json({});
    }
    
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('deleteItem error:', error);
    res.json(null);
  }
});

app.post('/updateItem', async (req, res) => {
  try {
    const { id, name, desc } = req.query;
    
    if (!id || !name || !desc || isNaN(id)) {
      return res.json(null);
    }
    
    const [updateResult] = await pool.query(
      'UPDATE Items SET name = ?, `desc` = ? WHERE id = ?', 
      [name, desc, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.json({});
    }
    
    const [updatedItem] = await pool.query(
      'SELECT * FROM Items WHERE id = ?',
      [id]
    );
    
    res.json(updatedItem[0]);
  } catch (error) {
    console.error('updateItem error:', error);
    res.json(null);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
