var
    chai = require('chai'),
    gcConnector = require('../lib/google'),
    dsSettings = require('./resource/datasource-test.json');

global.expect = chai.expect;
global.assert = chai.assert;
global.should = chai.should;

var DataSource = require('loopback-datasource-juggler').DataSource;


global.getConnector = function () {
    var dataSource = {};
    return new gcConnector.GoogleData(dsSettings, dataSource);
};

global.getDataSource = global.getSchema = function (options) {
  var db = new DataSource(require('../'), options);
  return db;
};
