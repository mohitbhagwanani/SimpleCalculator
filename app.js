const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

let currentValue = 0;
let history = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/init', (req, res) => {
  const num1 = Number(req.body.number1);
  const num2 = Number(req.body.number2);
  const add = num1 + num2;
  currentValue = add;
  res.send('Value is ' + add);
});

app.post('/operation', (req, res) => {
  const num1 = Number(req.body.number1);
  const num2 = Number(req.body.number2);
  const operation = req.body.operation;

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Invalid numbers' });
  }

  let result;
  switch (operation) {
    case 'add':
      result = num1 + num2;
      break;
    case 'subtract':
      result = num1 - num2;
      break;
    case 'multiply':
      result = num1 * num2;
      break;
    case 'divide':
      if (num2 === 0) {
        return res.status(400).json({ error: 'Division by zero' });
      }
      result = num1 / num2;
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation' });
  }

  currentValue = result;
  history.push({ num1, num2, operation, result });

  res.send('Result: ' + result);
});

app.get('/undo', (req, res) => {
  if (history.length === 0) {
    return res.status(400).json({ error: 'No operations to undo' });
  }

  const lastOperation = history.pop();
  currentValue = lastOperation.result;
  res.json({ result: currentValue });
});

app.get('/reset', (req, res) => {
  currentValue = 0;
  history = [];
  res.end('Calculator reset');
});
