const ERROR_DATA = 400;
const NOT_FOUND = 404;

module.exports = (err, req, res, next)  => {
    if (err.name === 'CastError' || err.message === 'NotValidRequest') {
      return res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
    } else if (err.message === 'NotValidCardId') {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    } else if (err.message === 'NotValidId') {
      return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
    } else if (err.statusCode) {
      res.status(err.statusCode).send({message: err.message});
    } else {
    const { statusCode = 500, message } = err;

    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message
      });
  }
  next();
}