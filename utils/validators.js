const { body } = require('express-validator/check')
const User = require('../models/user')


exports.courseValidators = [
  body('title').isLength({ min: 3 })
    .withMessage('Минимальная длинаа названия 3 символа').trim(),
  body('price').isNumeric().withMessage('Введите корректную цену'),
  body('img', 'Введите корректеый Url картинки').isURL(),
]

exports.registerValidators = [
  body('email').isEmail().withMessage('Введите корректный email')
    .custom(async (value, { req}) => {
    try {
      const user = await User.findOne({ email: value })
      if(user) {
        return Promise.reject('Такой email уже занят')
      }
    } catch (e) {
      console.log(e)
    }
  }).normalizeEmail(),
  body('password', 'Пароль долженбыть минимум 6 символов')
    .isLength({ min: 6, max: 56, }).isAlphanumeric()
    .trim(),
  body('confirm', ).custom((value, { req}) => {
    if(value !== req.body.password){
      throw new Error('Пароли должны совпадать')
    }
    return true
  })
    .trim(),
  body('name').isLength({ min: 3 }).withMessage('Имя долэно быть минимум 3 символа')
    .trim(),
]