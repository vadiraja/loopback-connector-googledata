var
    init = require('./init'),
    modelTest = require('./resource/model-test.json'),
    mockTest = require('./resource/mock-data-test');

    describe('When convert Google Data result to loopback model', function () {
        
        var testConnector;
        var dataModeled = {};
        before( function () {
            testConnector = getConnector();
            testConnector._models.test = modelTest;
        });
        
        it('should run convert function', function (done) {
            dataModeled = testConnector.matchDataToModel("test", mockTest);
            expect(dataModeled).not.to.be.null;
            done();
        });
        
    });