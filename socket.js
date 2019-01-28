module.exports = (server)=> {
  // sensing用プロセスを起動
  const child = require("child_process").fork(__dirname + "/sensor");

  const io = require('socket.io')(server);
  io.on('connection',(socket)=> {
    socket.emit("connected", {hello: "world"});

    // Sensorプロセスからのメッセージ受信
    child.on("message", function(data){
      console.log(data);
      socket.emit("sensor", data);
    });
  });
};
