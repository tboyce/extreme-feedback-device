var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var router = express.Router();

var jsonParser = bodyParser.json();

var builds = {};

router.get('/', function(req, res, next) {
    return res.json(builds);
});

router.post('/', jsonParser, function(req, res, next) {
    var build = req.body;
    builds[build.resource.definition.id] = build;
    res.sendStatus(200);
});

router.get('/status', function(req, res, next) {
   if (_.every(builds, {'resource': { 'status': 'succeeded' }})) {
       return res.json({status: 'success'});
   } else {
       return res.json({status: 'failure'});
   }
});

module.exports = router;
