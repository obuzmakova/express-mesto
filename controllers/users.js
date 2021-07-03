const User = require('../models/user');

const SUCCESS_STATUS = 200;
const ERROR_DATA = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(new Error('NotValidRequest'))
    .then((users) => {
      res.status(SUCCESS_STATUS).send(users);
    })
    .catch((err) => {
      if (err.message === 'NotValidRequest') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: 'Передан невалидный id' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidRequest'))
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidCardId') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidCardId') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
