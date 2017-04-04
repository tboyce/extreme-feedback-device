var Service = require('node-windows').Service;

var svc = new Service({
  name: 'xfd',
  script: require('path').join(__dirname, 'server.js')
});

svc.on('uninstall', function () {
  console.log('Uninstall complete.');
});

svc.uninstall();
