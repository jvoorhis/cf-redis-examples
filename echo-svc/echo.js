var cf         = require('cf-runtime'),
    subscriber = cf.RedisClient.createFromSvc('redis-rtt'),
    publisher  = cf.RedisClient.createFromSvc('redis-rtt');

subscriber.on("pmessage", function(pattern, channel, message) {
  replyChannel = "client:" + channel.split(":")[1];
  publisher.publish(replyChannel, message);
});

subscriber.psubscribe("server:*");
