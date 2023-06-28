// const kue = require('kue');
// const redis = require('redis');

// kue.redis.createClient = function () {
//     var client = redis.createClient();

//     client.on("error", function (err) {
//         console.log("trolllolo");
//     });
//     return client;
// };

// const queue = kue.createQueue();

// module.exports = queue; 