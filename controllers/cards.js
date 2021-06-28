const Card = require('../models/card');

const ERROR_DATA = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.json(cards);
      }
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.json(card);
      }
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.json(card);
      }
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.json(card);
      }
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.json(card);
      }
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};
