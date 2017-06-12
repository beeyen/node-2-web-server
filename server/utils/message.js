var moment = require('moment');
var generateMessage = (from, text) => {
  return {
    from: from,
    text: text,
    createdAt: moment().valueOf()
  }
}
var generateLocationMessage = (from, longitude, latitude) => {
  return {
    from: from,
    url: 'https://www.google.com/search?q=' + longitude + ',' + latitude,
    createdAt: moment().valueOf()
  }
}
module.exports = {generateMessage, generateLocationMessage};
