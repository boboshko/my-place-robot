const { Markup } = require('telegraf');
const text = require('./data/text/keyboards');

// Стандартная клавиатура
exports.main = Markup
  .keyboard([
    [text.main[0], text.main[1]]
  ])
  .resize()
  .extra();

// Клавиатура отправки сообщения
exports.edit = Markup
  .keyboard([
    [text.edit[0]]
  ])
  .resize()
  .extra();
