const net = require("net");

const client = new net.Socket();

client.connect(5001, "127.0.0.1", () => {
  console.log("connected!");
  client.write("000000000000000;");
  client.write("##,imei:000000000000000,A;");
  client.write("imei:000000000000000,tracker,191107094108,,F,014108.00,A,0254.41073,S,04145.42314,W,,;");
  // client.end();
});