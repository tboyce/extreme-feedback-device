const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const storage = require('node-persist');
const router = express.Router();
const jsonParser = bodyParser.json();
const config = require('../config');
const request = require('request');

storage.init().then(function () {
  const storageKey = 'deployments';

  router.get('/', function (req, res) {
    const page = req.query.page || 1;
    const count = req.query.count || 10;
    storage.getItem(storageKey).then(function (deployments) {
      const items = _.sortBy(_.values(deployments || {}), 'name');
      return res.json({
        total: items.length,
        items: _.map(_.nth(_.chunk(items, count), page - 1) || [], function (deployment) {
          deployment.url = config.deployments_base_url + deployment.id;
          return deployment;
        })
      });
    });
  });

  router.post('/', jsonParser, function (req, res) {
    const deployment = req.body;
    storage.getItem(storageKey).then(function (deployments) {
      deployments = deployments || {};
      const event = deployment.Payload.Event;
      const project = event.RelatedDocumentIds[1];

      deployments[project] = {
        id: event.RelatedDocumentIds[1],
        name: event.RelatedDocumentIds[1],
        status: event.Category,
        time: new Date(),
        requestedFor: event.Username
      };

      var options = {
        url: config.octopus.url + '/projects/' + project,
        headers: {
          'X-Octopus-ApiKey': config.octopus.key
        }
      };

      request.get(options, function (error, response, body) {
        if (!error && body) {
          var detail = JSON.parse(body);
          deployments[project].name = detail.Name;
        }
        storage.setItem(storageKey, deployments);
        res.sendStatus(200);
      });
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
