const Card = require('../models/card');

const SUCCESS_STATUS = 200;
const ERROR_DATA = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(new Error('NotValidRequest'))
    .then((cards) => {
      res.status(SUCCESS_STATUS).send(cards);
    })
    .catch((err) => {
      if (err.message === 'NotValidRequest') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidCardId'))
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidCardId') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidCardId'))
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidCardId') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidCardId'))
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidCardId') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
