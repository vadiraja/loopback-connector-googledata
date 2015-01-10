var init = require('./init'),
modelTest = require('./resource/model-test.json'),
mockTest = require('./resource/mock-data-test');
var DataSource = require('loopback-datasource-juggler').DataSource;
// var ds = new DataSource(require('../lib/google'),{});

var UserEntity;

var ds, DummyModel, odb, config
describe('Datasource', function () {
    // var Customer = ds.createModel('Customer', {seq: {type: Number, id: true}, name: String, emails: [String], age: Number});
    
    before(function () {
        require('./init.js');
        config = require('rc')('loopback', {dev: {googledata: {}}}).dev.googledata;
        ds = getDataSource();
        // odb = getDataSource({collation: 'utf8_general_ci', createDatabase: true},config);
        // db = odb;
        
        // simplier way to describe model
        UserEntity = ds.define('UserEntity', {
          name: String,
          bio: String,
          approved: Boolean,
          joinedAt: Date,
          age: Number
        }, {plural: 'UserEntities'});
        
        ds.attach(UserEntity);
    });
    it('should connect to Google', function (done) {
        // console.log(db);
        done();
    });
    
    it('should find Users',function(done) {
      
        UserEntity.findById('4659244141903872',function (err, test) {
            console.log(test);
            // assert.equal(2, test.length);
            done();
        });
        
   
        // Customer.findById(1,function (err,test) {
        //   console.log(test);
        //   done(err, test);
        // });
    });

});