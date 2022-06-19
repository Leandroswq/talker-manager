const express = require('express');
const bodyParser = require('body-parser');
const { HTTP_OK_STATUS } = require('./status');

const app = express();
app.use(bodyParser.json());

const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).json();
});

const talkerRouter = require('./routers/talker/index');

app.use('/talker', talkerRouter);

app.listen(PORT, () => {
  console.log('Online');
});
