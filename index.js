const express = require('express');
const bodyParser = require('body-parser');
const { HTTP_OK_STATUS, HTTP_INTERNAL_SERVER_ERROR } = require('./status');

const app = express();
app.use(bodyParser.json());

const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).json();
});

const talkerRouter = require('./routers/talker/index');
const loginRouter = require('./routers/login/index.js');

app.use('/talker', talkerRouter);
app.use('/login', loginRouter);

app.use((_err, _req, res, _next) => {
  res.status(HTTP_INTERNAL_SERVER_ERROR).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
