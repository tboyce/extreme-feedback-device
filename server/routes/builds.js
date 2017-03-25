const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const storage = require('node-persist');

const router = express.Router();

const jsonParser = bodyParser.json();

storage.init().then(function () {
    const storageKey = 'builds';

    router.get('/', function (req, res) {
        storage.getItem(storageKey).then(function (builds) {
            return res.json(_.values(builds || {}));
        });
    });

    router.post('/', jsonParser, function (req, res) {
        const build = req.body;
        storage.getItem(storageKey).then(function (builds) {
            builds = builds || {};
            builds[build.resource.definition.id] = {
                id: build.resource.definition.id,
                name: build.resource.definition.name,
                status: build.resource.status
            };
            storage.setItem(storageKey, builds);
            res.sendStatus(200);
        });
    });

    router.delete('/:id', function (req, res) {
        storage.getItem(storageKey).then(function (builds) {
            delete builds[req.params.id];
            storage.setItem(storageKey, builds);
            res.sendStatus(200);
        });
    });
});

module.exports = router;
