const dgram = require("dgram");
const port = 3333;

socket = dgram.createSocket('udp4');
socket.on('message', function (msg, info) {
  const data = JSON.parse(msg.toString());
  const x = data.x;
  const y = data.y;
  const distant = data.distant;
  if (x == 0 || y == 0) return;

  // for デバッグ
  if (-20 <x && x < 20) {
    console.log(data);
    // process.send(data);
  } else {
    process.send(data);
  }
});

socket.on('listening', function(){
  const address = socket.address();
  console.log(`listening on : ${address.address} : ${address.port}`);
});

socket.bind(port);