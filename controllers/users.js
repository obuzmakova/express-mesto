const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataErr = require('../errors/data-err');
const AuthErr = require('../errors/auth-err');
const NotFoundErr = require('../errors/not-found');

const SUCCESS_STATUS = 200;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d'});
      res.send({ token });
    })
    .catch(next)
};

module.exports.getProfileInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataErr ('Передан невалидный id');
      }
    })
    .catch(next)
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(new Error('NotValidRequest'))
    .then((users) => {
      res.status(SUCCESS_STATUS).send(users);
    })
    .catch((err) => {
      if (err.message === 'NotValidRequest') {
        throw new DataErr ('Переданы некорректные данные');
      }
    })
    .catch(next)
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundErr ('Пользователь с указанным _id не найден');
      } else if (err.name === 'CastError') {
        throw new DataErr ('Передан невалидный id');
      }
    })
    .catch(next)
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash
    }))
    .then((user) => res.status(SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new DataErr ('Переданы некорректные данные');
      }
    })
    .catch(next)
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidRequest'))
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError'|| err.name === 'ValidationError') {
        throw new DataErr ('Переданы некорректные данные');
      } else if (err.message === 'NotValidRequest') {
        throw new NotFoundErr ('Пользователь с указанным _id не найден');
      }
    })
    .catch(next)
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidRequest'))
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError'|| err.name === 'ValidationError') {
        throw new DataErr ('Переданы некорректные данные');
      } else if (err.message === 'NotValidRequest') {
        throw new NotFoundErr ('Пользователь с указанным _id не найден');
      }
    })
    .catch(next)
};
