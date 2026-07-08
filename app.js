const express = require('express');
const app = express();
const port = 3000;

app.get('/', (request, response) => {
  response.send('<h1>Привет, Октагон!</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
