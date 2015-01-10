var init = require('./init'),
modelTest = require('./resource/model-test.json'),
mockTest = require('./resource/mock-data-test');

var ModelBuilder = require('loopback-datasource-juggler').ModelBuilder;
var modelBuilder = new ModelBuilder();

// simplier way to describe model
var Testing = modelBuilder.define('Testing', {
  name: String,
  bio: ModelBuilder.Text,
  approved: Boolean,
  joinedAt: Date,
  age: Number
});



describe('CRUD Test', function () {
    var testConnector;

    before(function () {
        testConnector = getConnector();
        testConnector._models.test = modelTest;
        testConnector._models.Testing = Testing;
    });
    
    it('should create Entity Key',function(done) {
    //   testConnector = getConnector();
    //   testConnector._models.test = modelTest;
        // testConnector._models.Testing = Testing;
       var testData = testConnector.matchDataToModel('Testing', Testing,function(err,result){
           expect(err).to.be.null;
        //   console.log(result);
             
       });
    //   var id = testConnector.create('test',mockTest);
        console.log(testData)
       
         done();
    });
    
    it('should find By Entity Id',function (done) {
        testConnector.find('UserEntity','4659244141903872', function (err,entity) {
            expect(entity).not.to.be.null;
            expect(err).to.be.null;
            // expect(entity).to.have.length(1);
            done();
        })
    });

    it('should find Entity', function (done) {
        // var id = testConnector.makeKey('a');
        // expect(id).not.to.be.null;
        // expect(id).to.be.a('string').to.contain(testConnector.searchIndex.concat('_'));
        testConnector.all('Testing','null',function(err, result){
            
           expect(result).not.to.be.null;
           expect(err).to.be.null;
           done();
       });
       
      
    });
});