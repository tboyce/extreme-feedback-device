var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var router = express.Router();

var jsonParser = bodyParser.json();

var deployments = {};

router.get('/', function(req, res, next) {
    return res.json(deployments);
});

router.post('/', jsonParser, function(req, res, next) {
    var deployment = req.body;
    deployments[deployment.Payload.Event.RelatedDocumentIds[1]] = deployment.Payload.Event;
    res.sendStatus(200);
});

router.get('/status', function(req, res, next) {
    var failed = _.filter(deployments, {'Category': 'DeploymentFailed'});
    if (failed.length === 0) {
        return res.json({status: 'success'});
   } else {
        return res.json({status: 'failure'});
   }
});

module.exports = router;
