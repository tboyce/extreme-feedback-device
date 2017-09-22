var expect = require('chai').expect
var superagent = require('superagent');
var server = require('../server');
var config = require('../config');
var status = require('http-status');

var baseUrl = 'http://localhost:3000/api/v1';

var nock = require('nock');
nock('http://deployments', {
  reqheaders: {
    'X-Octopus-ApiKey': 'test'
  }
})
  .get('/projects/1')
  .reply(200, {Name: 'API'});

nock('http://builds', {
  reqheaders: {
    'authorization': 'Basic dGVzdDp0ZXN0'
  }
})
  .get('/1')
  .reply(200, {
    requestedFor: {
      displayName: 'tester1'
    },
    requestedBy: {
      displayName: 'tester2'
    }
  });

describe('/builds', function () {
  var app;

  before(function () {
    app = server();
  });

  after(function () {
    app.close();
  });

  var build = {
    resource: {
      status: 'passed',
      definition: {
        id: 1,
        name: 'Test Release'
      },
      url: 'http://builds/1'
    }
  };

  it('route exists', function (done) {
    superagent.get(baseUrl + '/builds').end(function (err, res) {
      expect(err).not.to.be.an('error');
      expect(res.status).to.eql(status.OK);
      done();
    });
  });

  it('post new build', function (done) {
    superagent.post(baseUrl + '/builds', build).end(function () {
      superagent.get(baseUrl + '/builds').end(function (err, res) {
        expect(err).not.to.be.an('error');
        expect(res.status).to.eql(status.OK);
        var result = JSON.parse(res.text);

        var expected = {
          id: build.resource.definition.id,
          name: build.resource.definition.name,
          status: build.resource.status,
          url: build.resource.url,
          requestedFor: 'tester1'
        };

        expect(result.total).to.eql(1);
        var item = result.items[0];
        expect(item).to.have.property('time');
        delete item.time;
        expect(item).to.deep.eql(expected);
        done();
      });
    });
  });

  it('delete build', function (done) {
    superagent.post(baseUrl + '/builds', build).end(function () {
      superagent.delete(baseUrl + '/builds/' + build.resource.definition.id).end(function (err, res) {
        expect(err).not.to.be.an('error');
        expect(res.status).to.eql(status.OK);
        superagent.get(baseUrl + '/builds').end(function (err, res) {
          expect(err).not.to.be.an('error');
          expect(res.status).to.eql(status.OK);
          var result = JSON.parse(res.text);
          expect(result.total).to.eql(0);
          done();
        });
      });
    });
  });

});


describe('/deployments', function () {
  var app;

  before(function () {
    app = server();
  });

  after(function () {
    app.close();
  });

  var deployment = {
    Payload: {
      Event: {
        Category: 'DeploymentSucceeded',
        Username: 'tboyce',
        RelatedDocumentIds: ['', '1']
      }
    }
  };

  it('route exists', function (done) {
    superagent.get(baseUrl + '/deployments').end(function (err, res) {
      expect(err).not.to.be.an('error');
      expect(res.status).to.eql(status.OK);
      done();
    });
  });

  it('post new deployment', function (done) {
    superagent.post(baseUrl + '/deployments', deployment).end(function () {
      superagent.get(baseUrl + '/deployments').end(function (err, res) {
        expect(err).not.to.be.an('error');
        expect(res.status).to.eql(status.OK);
        var result = JSON.parse(res.text);

        var event = deployment.Payload.Event;
        var id = event.RelatedDocumentIds[1];
        var expected = {
          id: id,
          name: 'API',
          requestedFor: event.Username,
          status: event.Category,
          url: config.octopus.url + id
        };

        expect(result.total).to.eql(1);
        var item = result.items[0];
        expect(item).to.have.property('time');
        delete item.time;
        expect(item).to.deep.eql(expected);
        done();
      });
    });
  });

  it('delete deployment', function (done) {
    superagent.post(baseUrl + '/deployments', deployment).end(function () {
      superagent.delete(baseUrl + '/deployments/' + deployment.Payload.Event.RelatedDocumentIds[1]).end(function (err, res) {
        expect(err).not.to.be.an('error');
        expect(res.status).to.eql(status.OK);
        superagent.get(baseUrl + '/deployments').end(function (err, res) {
          expect(err).not.to.be.an('error');
          expect(res.status).to.eql(status.OK);
          var result = JSON.parse(res.text);
          expect(result.total).to.eql(0);
          done();
        });
      });
    });
  });

});

describe('/maintenance', function () {
  var app;

  before(function () {
    app = server();
  });

  after(function () {
    app.close();
  });

  it('route exists', function (done) {
    superagent.get(baseUrl + '/maintenance').end(function (err, res) {
      expect(err).not.to.be.an('error');
      expect(res.status).to.eql(status.OK);
      done();
    });
  });

  it('post and delete toggles maintenance mode', function (done) {
    superagent.post(baseUrl + '/maintenance').end(function () {
      superagent.get(baseUrl + '/maintenance').end(function (err, res) {
        expect(err).not.to.be.an('error');
        expect(res.status).to.eql(status.OK);
        var result = JSON.parse(res.text);
        expect(result).to.eql(true);

        superagent.delete(baseUrl + '/maintenance').end(function (err, res) {
          expect(err).not.to.be.an('error');
          expect(res.status).to.eql(status.OK);

          superagent.get(baseUrl + '/maintenance').end(function (err, res) {
            expect(err).not.to.be.an('error');
            expect(res.status).to.eql(status.OK);
            var result = JSON.parse(res.text);
            expect(result).to.eql(false);
            done();
          });
        });
      });
    });
  });

});

describe('/status', function () {
  var app;

  before(function () {
    app = server();
  });

  after(function () {
    app.close();
  });

  it('route exists', function (done) {
    superagent.get(baseUrl + '/status').end(function (err, res) {
      expect(err).not.to.be.an('error');
      expect(res.status).to.eql(status.OK);
      done();
    });
  });

});
