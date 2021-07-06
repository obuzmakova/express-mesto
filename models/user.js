const mongoose = require('mongoose');
const validator = require('validator');;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
});

module.exports = mongoose.model('user', userSchema);
