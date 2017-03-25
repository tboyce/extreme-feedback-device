const express = require('express');
const bodyParser = require('body-parser');
const storage = require('node-persist');

const router = express.Router();

const jsonParser = bodyParser.json();

storage.init().then(function () {
    const storageKey = 'v1/maintenance';
    let maintenance;

    storage.getItem(storageKey).then(function (item) {
        maintenance = item || false;
    });

    router.get('/', function (req, res) {
        return res.json(maintenance);
    });

    router.post('/', jsonParser, function (req, res) {
        maintenance = true;
        storage.setItem(storageKey, maintenance);
        res.sendStatus(200);
    });

    router.delete('/', jsonParser, function (req, res) {
        maintenance = false;
        storage.setItem(storageKey, maintenance);
        res.sendStatus(200);
    });

    router.get('/status', function (req, res) {
        return res.json({
            status: maintenance
        });
    });
});

module.exports = router;
