const request = require('request');

const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ipAddress = JSON.parse(body)['ip'];
    ipAddress !== null ? callback(null, ipAddress) : callback(ipAddress, null);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/json/${ip}`,  (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    if (!error) {
      const {latitude, longitude} = JSON.parse(body)['data'];
      callback(null, {latitude, longitude});
    }
  });

};

const fetchISSFlyOverTimes = function({latitude, longitude}, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${Number(latitude).toFixed(2)}&lon=${Number(longitude).toFixed(2)}`;

  request(url,  (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS passing time. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // return callback(null, );
    callback(null, JSON.parse(body)['response']);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, geo) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(geo, (error, time) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, time)
      })
    })
  })
}

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };