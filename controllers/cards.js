const Card = require('../models/card');
const DataErr = require('../errors/data-err');
const NotFoundErr = require('../errors/not-found');

const SUCCESS_STATUS = 200;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(new Error('NotValidRequest'))
    .then((cards) => {
      res.status(SUCCESS_STATUS).send(cards);
    })
    .catch((err) => {
      if (err.message === 'NotValidRequest') {
        throw new DataErr ('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new DataErr ('Переданы некорректные данные');
      }
    })
    .catch(next)
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidCardId'))
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataErr ('Переданы некорректные данные');
      } else if (err.message === 'NotValidCardId') {
        throw new NotFoundErr ('Карточка с указанным _id не найдена');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidCardId'))
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataErr ('Переданы некорректные данные');
      } else if (err.message === 'NotValidCardId') {
        throw new NotFoundErr ('Карточка с указанным _id не найдена');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidCardId'))
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataErr ('Переданы некорректные данные');
      } else if (err.message === 'NotValidCardId') {
        throw new NotFoundErr ('Карточка с указанным _id не найдена');
      }
    })
    .catch(next);
};
