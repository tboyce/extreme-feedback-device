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

    const sortedBuilds = _.sortBy(builds, 'time');
    const sortedDeployments = _.sortBy(deployments, 'time');

    const failedBuild = _.first(_.filter(sortedBuilds, function (b) {
      return b.status === 'failed' && (patterns.buildRegex.test(b.name));
    }));

    const failedTest = _.first(_.filter(sortedBuilds, function (b) {
      return b.status === 'failed' && (patterns.testRegex.test(b.name));
    }));

    const failedDeployment = _.first(_.filter(sortedDeployments, function (d) {
      return d.status === 'DeploymentFailed';
    }));

    var status = {
      build: failedBuild ? 'failed' : 'success',
      test: failedTest ? 'failed' : 'success',
      deployment: failedDeployment ? 'failed' : 'success',
      maintenance: maintenance || false
    };

    if (failedBuild) {
      status.buildFailedTime = failedBuild.time;
      status.buildFailedName = failedBuild.requestedFor;
    }
    if (failedTest) {
      status.testFailedTime = failedTest.time;
      status.testFailedName = failedTest.requestedFor;
    }
    if (failedDeployment) {
      status.deploymentFailedTime = failedDeployment.time;
      status.deploymentFailedName = failedDeployment.requestedFor;
    }

    return res.json(status);
  });

});

module.exports = router;
