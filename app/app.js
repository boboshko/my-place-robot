const Telegraf = require('telegraf');
const session = require('telegraf/session');
const config = require('./config');
const timeCalculation = require('./timeCalculation');
const keyboards = require('./keyboards');
const keyboardText = require('./data/text/keyboards');
const answers = require('./data/text/answers');
const systemAnswers = require('./data/text/system');

const app = new Telegraf(config.aprToken);
app.use(session());

// Обработка команды /start
app.start((ctx) =>
  ctx.reply(answers.start[0], keyboards.main)
);

// Обработка команды «Ближайший автобус»
app.hears(keyboardText.main[0], (ctx) =>
  ctx.replyWithMarkdown(timeCalculation.all())
);

// Обработка кнопки «Связаться»
app.hears(keyboardText.main[1], (ctx) =>  {
  ctx.session.message = true;
  return ctx.reply(systemAnswers.context[0], keyboards.edit);
});

// Обработка кнопки «Отмена»
app.hears(keyboardText.edit[0], (ctx) => {
  if (ctx.session.message) {

    // Сообщить об отмене
    // Вернуть стандартную клавиатуру
    ctx.reply(systemAnswers.success[1], keyboards.main);
    delete ctx.session.message;
  }

  // Сообщить, если произошла ошибка
  else {
    ctx.reply(systemAnswers.errors[1]);
  };
});

// Обработка всех остальных сообщений
app.on('text', (ctx) => {

  // Если до этого была нажата кнопка «Связаться»...
  if (ctx.session.message) {

    // ...то переслать это сообщение
    ctx.telegram.forwardMessage(

      // ID канала для отправки
      config.aprForwardingChannel,
      ctx.message.chat.id,
      ctx.message.message_id
    )
    .then(res => {

      // Сообщить, если пересылка сообщения удалась
      // Вернуть стандартную клавиатуру
      ctx.reply(systemAnswers.success[0], keyboards.main);
    })
    .catch(res => {

      // Сообщить, если пересылка сообщения не удалась
      // Вернуть стандартную клавиатуру
      ctx.reply(systemAnswers.errors[0], keyboards.main);
    });

    // Удалить из сессии информацию о том, что была нажата кнопка «Написать мне»
    delete ctx.session.message;
  }
  else {

    // ... если нет, то команда неизвестна
    ctx.reply(systemAnswers.errors[2]);
  };
});

// Запуск бота с помощью Long polling
// app.launch();

// Запуск бота с помощью Webhook
app.telegram.setWebhook(config.aprWebhook)
app.startWebhook(config.aprWebhookPath, null,  5000)
