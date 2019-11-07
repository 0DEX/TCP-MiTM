const open = require("amqplib").connect("amqp://35.198.22.223");

const q = "tasks";

open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  return ch.assertQueue(q).then((ok) => {
    return ch.consume(q, (msg) => {
      if (msg !== null) {
        const data = msg.content.toString();
        console.log(data);
        ch.ack(msg);
      }
    });
  });
});