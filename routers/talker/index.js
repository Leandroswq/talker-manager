const express = require('express');
const fs = require('fs').promises;
const { HTTP_NOT_FOUND_STATUS, HTTP_OK_STATUS } = require('../../status');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const talker = await fs.readFile('talker.json', 'utf-8');
    res.status(HTTP_OK_STATUS).json(JSON.parse(talker));
  } catch (err) {
    res.status(HTTP_NOT_FOUND_STATUS).send();
  }
});

module.exports = router;