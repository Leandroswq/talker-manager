const express = require('express');
const moment = require('moment');
const fs = require('fs').promises;
const { HTTP_NOT_FOUND_STATUS, HTTP_OK_STATUS,
HTTP_INTERNAL_SERVER_ERROR, HTTP_UNAUTHORIZED_STATUS,
 HTTP_BAD_REQUEST_STATUS, HTTP_CREATED_STATUS,
 HTTP_NO_CONTENT } = require('../../status');

const router = express.Router();
 
const readTalker = async () => {
  const response = await fs.readFile('talker.json', 'utf-8');
  const talkers = JSON.parse(response);
  return talkers;
};

router.get('/', async (_req, res, next) => {
  try {
    const talker = await readTalker();
    res.status(HTTP_OK_STATUS).json(talker);
  } catch (_err) {
    res.status(HTTP_NOT_FOUND_STATUS).send();
  }
  next(HTTP_INTERNAL_SERVER_ERROR);
});

const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(HTTP_UNAUTHORIZED_STATUS)
    .json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    res.status(HTTP_UNAUTHORIZED_STATUS)
    .json({ message: 'Token inválido' });
  }
  next();
};

const nameValidation = (req, res, next) => {
  const { name } = req.body;
  if (!name || name === '') {
    res.status(HTTP_BAD_REQUEST_STATUS)
    .json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    res.status(HTTP_BAD_REQUEST_STATUS)
    .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const ageValidation = (req, res, next) => {
  const { age } = req.body;
  if (!age || age === '') {
    res.status(HTTP_BAD_REQUEST_STATUS)
    .json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
    res.status(HTTP_BAD_REQUEST_STATUS)
    .json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    res.status(HTTP_BAD_REQUEST_STATUS)
    .json({ message: 'O campo "talk" é obrigatório' });
  }
  if (!talk.watchedAt) {
    res.status(HTTP_BAD_REQUEST_STATUS)
    .json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  const date = moment(talk.watchedAt, 'DD/MM/YYYY', true);

  if (!date.isValid()) {
    res.status(HTTP_BAD_REQUEST_STATUS)
    .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const isNumberBetween = (number, min, max) => {
  if (number >= min && number <= max) {
    return true;
  }
  return false;
};

const rateValidation = (req, res, next) => {
  const { rate } = req.body.talk;
  if (rate === undefined || rate === '') {
    res.status(HTTP_BAD_REQUEST_STATUS)
    .json({ message: 'O campo "rate" é obrigatório' });
  }

  if (!Number.isInteger(Number(rate)) || !isNumberBetween(rate, 1, 5)) {
    res.status(HTTP_BAD_REQUEST_STATUS)
    .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
};
router.post('/', tokenValidation, nameValidation,
 ageValidation, talkValidation, rateValidation, async (req, res, next) => {
  const { name, age, talk } = req.body;
  try {
    const talkers = await readTalker();
    const id = talkers
    .sort((a, b) => Number(b.id) - Number(a.id))[0].id + 1;
    const talke = { id, name, age, talk };
    talkers.push(talke);
    await fs.writeFile('talker.json', JSON.stringify(talkers));
    res.status(HTTP_CREATED_STATUS).json(talke);
  } catch (err) {
    next(HTTP_INTERNAL_SERVER_ERROR);
  }
  next(HTTP_INTERNAL_SERVER_ERROR);
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
  const talkers = await readTalker();
  const talker = talkers.find((element) => Number(element.id) === Number(id));
  if (talker) {
    res.status(HTTP_OK_STATUS).json(talker);
  }
  res.status(HTTP_NOT_FOUND_STATUS)
  .json({ message: 'Pessoa palestrante não encontrada' });
  } catch (_err) {
    res.status(HTTP_NOT_FOUND_STATUS).send();
  }
  next(HTTP_INTERNAL_SERVER_ERROR);
});

router.put('/:id', tokenValidation, nameValidation, ageValidation,
talkValidation, rateValidation, async (req, res, next) => {
  const { name, age, talk } = req.body;
  const { id } = req.params;
  try {
    const talkers = await readTalker();
    const talker = talkers.find((element) => Number(element.id) === Number(id));
    talker.age = age;
    talker.talk = talk;
    talker.name = name;
    await fs.writeFile('talker.json', JSON.stringify(talkers));
    res.status(HTTP_OK_STATUS).json(talker);
  } catch (err) {
    next(HTTP_INTERNAL_SERVER_ERROR);
  }
  next(HTTP_INTERNAL_SERVER_ERROR);
});

router.delete('/:id', tokenValidation, async (req, res, next) => {
  const { id } = req.params;
  try {
    const talkers = await readTalker();
    const newTalkers = talkers
    .filter((talker) => Number(talker.id) !== Number(id));
    await fs.writeFile('talker.json', JSON.stringify(newTalkers));
    res.status(HTTP_NO_CONTENT).send();
  } catch (err) {
    next(HTTP_INTERNAL_SERVER_ERROR);
  }
  next(HTTP_INTERNAL_SERVER_ERROR);
});

module.exports = router;
