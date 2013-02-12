var cf      = require('cf-runtime'),
    express = require('express'),
    app     = express();

app.get('/', function(req, rep) {
  var subscriber = cf.RedisClient.createFromSvc('redis-rtt'),
      publisher  = cf.RedisClient.createFromSvc('redis-rtt');

  publisher.incr("rtt:counter", function(err, counter) {
    subscriber.on("message", function(channel, message) {
      var lat = Date.now() - parseInt(message);
      rep.end("Latency is " + lat + "ms");
      subscriber.unsubscribe(channel);
      subscriber.end();
    });
    subscriber.subscribe("client:" + counter);
    publisher.publish("server:" + counter, Date.now());
    publisher.end();
  });
});

app.listen(process.env.VCAP_APP_PORT);
