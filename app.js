const express = require('express');
const app = express();
const port = 3000;

app.get('/', (request, response) => {
  response.send('<h1>Привет, Октагон!</h1>');
});


app.get('/static', (req, res) => {
  res.json({ header: 'Hello', body: 'Octagon NodeJS Test' });
});


app.get('/dynamic', (req, res) => {
  const a = req.query.a;
  const b = req.query.b;
  const c = req.query.c;

  
  if (a === undefined || b === undefined || c === undefined) {
    return res.json({ header: 'Error' });
  }

  const numA = Number(a);
  const numB = Number(b);
  const numC = Number(c);

  if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
    return res.json({ header: 'Error' });
  }

  const result = (numA * numB * numC) / 3;
  res.json({ header: 'Calculated', body: String(result) });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
