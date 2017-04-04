const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const storage = require('node-persist');
const router = express.Router();
const jsonParser = bodyParser.json();
const patterns = require('../patterns');
const config = require('../config');

storage.init().then(function () {
  const storageKey = 'builds';

  router.get('/', function (req, res) {
    const page = req.query.page || 1;
    const count = req.query.count || 10;
    storage.getItem(storageKey).then(function (builds) {
      const items = _.sortBy(_.values(builds || {}), 'name');

      const filteredItems = _.filter(items, function (item) {
        return patterns.testRegex.test(item.name) || patterns.buildRegex.test(item.name);
      });

      return res.json({
        total: filteredItems.length,
        items: _.map(_.nth(_.chunk(filteredItems, count), page - 1) || [], function(build) {
          build.url = config.builds_base_url + build.id;
          return build;
        })
      });
    });
  });

  router.post('/', jsonParser, function (req, res) {
    const build = req.body;
    storage.getItem(storageKey).then(function (builds) {
      builds = builds || {};
      builds[build.resource.definition.id] = {
        id: build.resource.definition.id,
        name: build.resource.definition.name,
        status: build.resource.status,
        time: new Date()
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
