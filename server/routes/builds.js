const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const storage = require('node-persist');

const router = express.Router();

const jsonParser = bodyParser.json();

storage.init().then(function () {
    const storageKey = 'v1/builds';
    let builds;

    storage.getItem(storageKey).then(function (item) {
        builds = item || {};
    });

    router.get('/', function (req, res) {
        return res.json(builds);
    });

    router.post('/', jsonParser, function (req, res) {
        const build = req.body;
        builds[build.resource.definition.id] = build;
        storage.setItem(storageKey, builds);
        res.sendStatus(200);
    });

    router.delete('/:id', function (req, res) {
        delete builds[req.params.id];
        storage.setItem(storageKey, builds);
        res.sendStatus(200);
    });

    router.get('/status', function (req, res) {
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

module.exports = router;
