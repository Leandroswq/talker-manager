const express = require("express");
const { HTTP_OK_STATUS, HTTP_BAD_REQUEST_STATUS } = require("../../status");
const tokeGenerator = require("../../helpers/token");

const router = express.Router();
const tokenSize = 16;

const emailValidation = (req, res, next) => {
  const { email } = req.body;
  const regexEmail = /\S+@\S+\.\S+/;
  if (!email || email === "") {
    res
      .status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "email" é obrigatório' });
  }
  if (regexEmail.test(email) === false) {
    res
      .status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const passwordValidation = (req, res, next) => {
  const { password } = req.body;
  if (!password || password === "") {
    res
      .status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    res
      .status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

router.post("/", emailValidation, passwordValidation, (_req, res) => {
  res.status(HTTP_OK_STATUS).json({ token: tokeGenerator(tokenSize) });
});

module.exports = router;
