const express = require('express');
const router = express.Router();
const { check } = require("express-validator");
const { signup, accountActivation, signin } = require('../controller/auth');

/* GET users listing. */
router.post('/signup', [
    check("name", "Поле не должен быть пустым!").notEmpty(),
    check("password", "Пароль должон быть меньше 5 и болше 20").isLength({ min: 5, max: 20 }),
    check("email", "Поле не должен быть пустым и должен быть ЕМАИЛ").isEmail(),
], signup);
router.post('/signup-activation',  accountActivation);
router.post('/signin', [
    check("password", "Пароль должон быть меньше 5 и болше 20").isLength({ min: 5, max: 20 }),
    check("email", "Поле не должен быть пустым и должен быть ЕМАИЛ").isEmail(),
], signin);


module.exports = router;
