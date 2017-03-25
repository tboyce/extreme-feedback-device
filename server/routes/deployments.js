const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const storage = require('node-persist');

const router = express.Router();

const jsonParser = bodyParser.json();

storage.init().then(function () {
    const storageKey = 'v1/deployments';
    let deployments;

    storage.getItem(storageKey).then(function (item) {
        deployments = item || {};
    });

    router.get('/', function (req, res) {
        return res.json(deployments);
    });

    router.post('/', jsonParser, function (req, res) {
        const deployment = req.body;
        deployments[deployment.Payload.Event.RelatedDocumentIds[1]] = deployment.Payload.Event;
        storage.setItem(storageKey, deployments);
        res.sendStatus(200);
    });

    router.delete('/:id', function (req, res) {
        delete deployments[req.params.id];
        storage.setItem(storageKey, deployments);
        res.sendStatus(200);
    });

    router.get('/status', function (req, res) {
        const failed = _.filter(deployments, {'Category': 'DeploymentFailed'});
        if (failed.length === 0) {
            return res.json({status: 'success'});
        } else {
            return res.json({status: 'failure'});
        }
    });
});

module.exports = router;
