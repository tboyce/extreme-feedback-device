const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
let storage = require('node-persist');

const router = express.Router();

const jsonParser = bodyParser.json();

storage.init().then(function () {
    const storageKey = 'deployments';

    router.get('/', function (req, res) {
        storage.getItem(storageKey).then(function (deployments) {
            return res.send(_.values(deployments || {}));
        });
    });

    router.post('/', jsonParser, function (req, res) {
        const deployment = req.body;
        storage.getItem(storageKey).then(function (deployments) {
            deployments = deployments || {};
            let event = deployment.Payload.Event;
            deployments[event.RelatedDocumentIds[1]] = {
                id: event.RelatedDocumentIds[1],
                name: event.RelatedDocumentIds[1],
                status: event.Category
            };
            storage.setItem(storageKey, deployments);
            res.sendStatus(200);
        });
    });

    router.delete('/:id', function (req, res) {
        storage.getItem(storageKey).then(function (deployments) {
            delete deployments[req.params.id];
            storage.setItem(storageKey, deployments);
            res.sendStatus(200);
        });
    });
});

module.exports = router;
