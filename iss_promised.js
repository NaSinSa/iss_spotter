const request = require('request-promise-native');

const fetchMyIP = function(callback) {
  return request(`https://api.ipify.org?format=json`)
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body)['ip'];
  return request(`https://ipvigilante.com/json/${ip}`);
};


const fetchISSFlyOverTimes = function(geo) {
  const {latitude, longitude} = JSON.parse(geo)['data'];
  const url = `http://api.open-notify.org/iss-pass.json?lat=${Number(latitude).toFixed(2)}&lon=${Number(longitude).toFixed(2)}`;
  return request(url);
};

const nextISSTimesForMyLocation = function(callback) {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((time) => {
    const { response } = JSON.parse(time);
    return response;
  })
}


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
// module.exports = { nextISSTimesForMyLocation };
