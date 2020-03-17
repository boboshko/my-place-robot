const schedule = require('./data/schedule');
const { fromTheMetro } = schedule.RenaissanceAndSoftLine;
const { fromOffice } = schedule.RenaissanceAndSoftLine;

// Конвертация расписания в Timestamp
function convertTime(inArray, timeShift) {
  let outArray = [];
  let date = new Date();
  for (let i = 0; i < inArray.length; i++) {
    let timeCalculation = Math.floor(date.setHours(...inArray[i]) / 1000 + timeShift);
    outArray.push(timeCalculation);
  };
  return outArray;
};

// Найти подходящий Timestamp в массиве (если есть)
function getMatchTime(array, now) {
  let match = array.find(array => array >= now);
  if (match === undefined) {
    match = false;
  };
  return match;
};

// Конвертировать Timestamp в минуты до автобуса
function timestampToMinutes(timestamp, now) {
  let minutes = Math.floor((timestamp - now) / 60);
  return minutes;
};

// Конвертировать Timestamp в расписание автобусов
function timestampToHours(timestamp, timeShift) {
  let date = new Date((timestamp - timeShift) * 1000);
  let hours = date.getHours();
  let minutes = '0' + date.getMinutes();
  return formattedTime = hours + ':' + minutes.substr(-2);
};

// Определить окончание у слова «минут»
function pluralForms(number, titles) {
  cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10:5]];
};

// Определить день недели
function whatDayIsToday(now, timeShift) {
  let date = new Date((now - timeShift) * 1000);
  return result = date.getDay();
};

// Получить объект с параметрами (если возможно)
function getTimeObject(arrayWeekdays, arrayFriday) {
  let timeShift = 10800;
  let now = Math.floor(Date.now() / 1000 + timeShift);
  let day = whatDayIsToday(now, timeShift);
  let array;
  // (day === 5) ? array = arrayFriday : (day >= 6) ? 'weekends' : array = arrayWeekdays;
  (day === 5) ? array = arrayFriday : array = arrayWeekdays;
  let outArray = convertTime(array, timeShift);
  let result = getMatchTime(outArray, now);
  if (!result) {
    return result;
  }
  else {
    let timeObject = {
      // dayOfTheWeek: day,
      departureTime: timestampToHours(result, timeShift),
      beforeDeparture: timestampToMinutes(result, now),
      wordDeclension: pluralForms(timestampToMinutes(result, now), ['минуту', 'минуты', 'минут'])
    };
    return timeObject;
  };
};

// Сформировать сообщение со временем
function parseTimeObject(arrayWeekdays, arrayFriday) {
  let object = getTimeObject(arrayWeekdays, arrayFriday)
  if (object === false) {
    return `Последний автобус уже уехал.`;
  }
  else if (object.departureTime === 0) {
    return `Автобус отходит прямо сейчас!`;
  }
  else {
    return `Через ${object.beforeDeparture} ${object.wordDeclension} в ${object.departureTime}`;
  };
};

// Сформировать всё сообщение
function getTextMessage() {
  let timeShift = 10800;
  let now = Math.floor(Date.now() / 1000 + timeShift);
  let textFromTheMetro = parseTimeObject(fromTheMetro.weekdays, fromTheMetro.friday);
  let textFromOffice = parseTimeObject(fromOffice.weekdays, fromOffice.friday);
  let day = whatDayIsToday(now, timeShift);
  if (day === 5) {
    return `Сегодня пятница. Расписание автобусов изменено.\n\n*От метро «Пролетарская»*\n${textFromTheMetro}\n\n*От БЦ «Новоспасский»*\n${textFromOffice}`;
  }
  else if (day === 6 || day === 0) {
    return `В выходные автобусы не ходят.`;
  }
  else if (textFromTheMetro === `Автобус отходит прямо сейчас!` && textFromOffice === `Автобус отходит прямо сейчас!`) {
    return `Все автобусы уже ухелали`;
  }
  else {
    return `*От метро «Пролетарская»*\n${textFromTheMetro}\n\n*От БЦ «Новоспасский»*\n${textFromOffice}`;
  };
};

exports.all = function() {
  return getTextMessage();
};
