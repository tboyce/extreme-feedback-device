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
            const response = _.map(_.values(builds), function (build) {
                return {
                    id: build.resource.definition.id,
                    name: build.resource.definition.name,
                    status: build.resource.status
                }
            });
            return res.json(response);
        });
    });

    router.post('/', jsonParser, function (req, res) {
        const build = req.body;
        storage.getItem(storageKey).then(function (builds) {
            builds = builds || {};
            builds[build.resource.definition.id] = build;
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

    router.get('/status', function (req, res) {
        storage.getItem(storageKey).then(function (builds) {
            const failedBuild = _.some(builds, function (b) {
                return b.resource.status === 'failed' &&
                    !(/test/i.test(b.resource.definition.name));
            });

            const failedTests = _.some(builds, function (b) {
                return b.resource.status === 'failed' &&
                    (/test/i.test(b.resource.definition.name));
            });

            return res.json({
                buildStatus: failedBuild ? 'failed' : 'success',
                testStatus: failedTests ? 'failed' : 'success'
            });
        });
    });

});

module.exports = router;
