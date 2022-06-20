const express = require('express');
const fs = require('fs').promises;
const { HTTP_NOT_FOUND_STATUS, HTTP_OK_STATUS,
HTTP_INTERNAL_SERVER_ERROR } = require('../../status');

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

module.exports = router;