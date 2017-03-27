const express = require('express');
const storage = require('node-persist');
const _ = require("lodash");
const router = express.Router();
const patterns = require('../patterns');

storage.init().then(function () {

  router.get('/', function (req, res) {
    const builds = storage.getItemSync('builds');
    const deployments = storage.getItemSync('deployments');
    const maintenance = storage.getItemSync('maintenance');

    const failedBuild = _.some(builds, function (b) {
      return b.status === 'failed' && (patterns.buildRegex.test(b.name));
    });

    const failedTest = _.some(builds, function (b) {
      return b.status === 'failed' && (patterns.testRegex.test(b.name));
    });

    const failedDeployment = _.some(deployments, function (d) {
      return d.status === 'DeploymentFailed';
    });

    return res.json({
      build: failedBuild ? 'failed' : 'success',
      test: failedTest ? 'failed' : 'success',
      deployment: failedDeployment ? 'failed' : 'success',
      maintenance: maintenance || false
    });
  });

});

module.exports = router;
