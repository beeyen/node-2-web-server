var generateMessage = (from, text) => {
  return {
    from: from,
    text: text,
    createdAt: new Date().getTime()
  }
}
var generateLocationMessage = (from, longitude, latitude) => {
  return {
    from: from,
    url: 'https://www.google.com/search?q=' + longitude + ',' + latitude,
    createdAt: new Date().getTime()
  }
}
module.exports = {generateMessage, generateLocationMessage};
