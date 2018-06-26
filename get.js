// My one example of a result integrated from the API data is the output of this file. To run, type `node get.js` into the terminal

let http = require('http');

http.get({
  hostname: 'mobile311-dev.sfgov.org',
  port: 80,
  /* for this path, the parameter `service_request_id` was used so I could find
  the specific example of the noise issue on HackerRank. The parameter used
  could have also been `address` or `service_name`, but I found this one to be
  the more likely use case if they are dealing with specific cases that have
  their own unique IDs */
  path: '/open311/v2/requests.json?service_request_id=1018298035',
  agent: false,
}, (res) => {
  let body = '';
  res.on("data", (chunk) => {
    body += chunk;
  });
  res.on("end", () => {
    /* we need to parse the body so we can get the values for the latitude and
    longitude keys and then plug them into the path enclosed in the get requests
    below */
    let data = JSON.parse(body)[0];
    http.get({
      hostname: 'api.openweathermap.org',
      port: 80,
      /* for this path, the client will need to pass their own API key from
      openweathermap, which requires creating an account – free or paid – and
      then retrieving their key from the 'API keys' section of their home
      and replacing the text after the path's 'APPID=' segment. They will not
      be able to access the API data without it. Activation takes ~10 minutes */
      path: `/data/2.5/weather?lat=${data.lat}&lon=${data.long}&APPID=d227bf5de99d2d01c3500b3c10123c07`,
      agent: false,
    }, (res) => {
      let body = '';
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        let weather = JSON.parse(body);
        /* this will print the desired result to the terminal/console by
        retrieving the specific information we want parsed from the data and
        weather info: service name, address, and the kind of weather for that
        location */
        console.log(data.service_name, " | ", data.address, " | ", weather.weather[0].main);
      });
    });
  });
});
