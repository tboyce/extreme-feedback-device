var Service = require('node-windows').Service;

var svc = new Service({
  name: 'xfd',
  description: 'Extreme Feedback Device',
  script: require('path').join(__dirname, 'server.js')
});

svc.on('install', function () {
  console.log('Install complete.');
  svc.start();
});

svc.install();
