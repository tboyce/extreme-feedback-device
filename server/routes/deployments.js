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
            const response = _.map(_.values(deployments), function (deployment) {
                return {
                    id: deployment.RelatedDocumentIds[1],
                    name: deployment.RelatedDocumentIds[1],
                    status: deployment.Category
                }
            });
            return res.send(response);
        });
    });

    router.post('/', jsonParser, function (req, res) {
        const deployment = req.body;
        storage.getItem(storageKey).then(function (deployments) {
            deployments = deployments || {};
            deployments[deployment.Payload.Event.RelatedDocumentIds[1]] = deployment.Payload.Event;
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

    router.get('/status', function (req, res) {
        storage.getItem(storageKey).then(function (deployments) {
            const failed = _.filter(deployments, {'Category': 'DeploymentFailed'});
            if (failed.length === 0) {
                return res.json({status: 'success'});
            } else {
                return res.json({status: 'failure'});
            }
        });
    });
});

module.exports = router;
