const Card = require('../models/card');
const AccessErr = require('../errors/access-err');

const SUCCESS_STATUS = 200;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(new Error('NotValidRequest'))
    .then((cards) => {
      res.status(SUCCESS_STATUS).send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch(next)
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidCardId'))
    .then((card) => {
      if ((req.user._id).toString() === (card.owner).toString()) {
        card.deleteOne();
        res.status(SUCCESS_STATUS).send(card);
      } else {
        throw new AccessErr ('Вы не имеете прав удалять чужие карточки');
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
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidCardId'))
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch(next);
};
