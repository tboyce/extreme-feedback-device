const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const storage = require('node-persist');
const router = express.Router();
const jsonParser = bodyParser.json();

storage.init().then(function () {
  const storageKey = 'deployments';

  router.get('/', function (req, res) {
    const page = req.query.page || 1;
    const count = req.query.count || 10;
    storage.getItem(storageKey).then(function (deployments) {
      const items = _.sortBy(_.values(deployments || {}), 'name');
      return res.json({
        total: items.length,
        items: _.nth(_.chunk(items, count), page - 1) || []
      });
    });
  });

  router.post('/', jsonParser, function (req, res) {
    const deployment = req.body;
    storage.getItem(storageKey).then(function (deployments) {
      deployments = deployments || {};
      const event = deployment.Payload.Event;
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
