const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  //if we lose connect to our redis server, automatically reconnect
  //once every second
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// called subscription because we're watching redis anytime
// a new value shows up
sub.on('message', (channel, message) => {
    // insert into hash called values
    // key: index we receive, so message
    redisClient.hset('values', message, fib(parseInt(message)));
});
// anytime someone inserts a new value into Redis, we're going to
// attempt to get that value and attempt to calculate the fib value
sub.subscribe('insert');
