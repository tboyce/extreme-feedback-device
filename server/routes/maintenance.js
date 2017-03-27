const express = require('express');
const bodyParser = require('body-parser');
const storage = require('node-persist');
const router = express.Router();
const jsonParser = bodyParser.json();

storage.init().then(function () {
  const storageKey = 'maintenance';

  router.get('/', function (req, res) {
    storage.getItem(storageKey).then(function (maintenance) {
      return res.json(maintenance || false);
    });
  });

  router.post('/', jsonParser, function (req, res) {
    const maintenance = true;
    storage.setItem(storageKey, maintenance);
    res.sendStatus(200);
  });

  router.delete('/', jsonParser, function (req, res) {
    const maintenance = false;
    storage.setItem(storageKey, maintenance);
    res.sendStatus(200);
  });

  router.get('/status', function (req, res) {
    storage.getItem(storageKey).then(function (maintenance) {
      return res.json({
        status: maintenance
      });
    });
  });
});

module.exports = router;
