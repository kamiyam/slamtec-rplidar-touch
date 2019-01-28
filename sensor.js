const child_process = require('child_process');
const proc = child_process.spawn(__dirname + '/bin/rplidar/ultra_simple', ['/dev/tty.SLAB_USBtoUART']);
console.log("child:" + proc.pid);

proc.stdout.on('data', (data) => {
  // const foo = 'theta: 208.41 Dist: 01013.00 Q: 47';
  const target = data.toString();
  const [,angle, distance, q] = target.match(/theta:.(\d+\.\d+).Dist:.(\d+\.\d+).Q:.(\d+)/);
  // console.log(angle, distance, q);
  const x = distance * Math.sin(angle * (Math.PI / 180));
  const y = distance * Math.cos(angle * (Math.PI / 180));
  const dis = parseFloat(distance);
  const result = {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    angle: parseFloat(angle),
    distance: dis
  };
  if (x == 0 || y == 0) return;
  // for デバッグ
  if (-20 <x && x < 20) {
    // console.log(result);
    process.send(result);
  } else {
    // process.send(result);
  }
});
