const schedule = require('./data/schedule');
const { fromTheMetro } = schedule.RenaissanceAndSoftLine;
const { fromOffice } = schedule.RenaissanceAndSoftLine;

// Конвертация расписания в Timestamp
function convertTime(inArray, timeShift) {
  let outArray = [];
  let date = new Date();
  for (var i = 0; i < inArray.length; i++) {
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
  (day === 5) ? array = arrayFriday : (day >= 6) ? 'weekends' : array = arrayWeekdays;
  let outArray = convertTime(array, timeShift);
  let result = getMatchTime(outArray, now);
  if (!result) {
    return result;
  }
  else {
    let timeObject = {
      dayOfTheWeek: day,
      departureTime: timestampToHours(result, timeShift),
      beforeDeparture: timestampToMinutes(result, now),
      wordDeclension: pluralForms(timestampToMinutes(result, now), ['минуту', 'минуты', 'минут'])
    };
    return timeObject;
  };
};

console.log(getTimeObject(fromTheMetro.weekdays, fromTheMetro.friday));
console.log(getTimeObject(fromOffice.weekdays, fromOffice.friday));
