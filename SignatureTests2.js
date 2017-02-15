//Trying to write a small test that hits our REST endpoint /esof/api/v1.0/system/signatures/{UUID}?userId=user.
//MochaJS is the test framework (describe/it), chai & chaiHttp to make requests, oracledb to grab data from database.

//In Mocha, anything with the before() hook like getSignatureByUUID is run before anything in an 'it' block.

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
var server = 'http://localhost:8080';
var response;
var UUID;

describe('GET /esof/api/v1.0/system/signatures/{UUID}?userId=user', function() {
    //Here's where my issue is.  I need to define UUID to pass into getSignatureByUUID.  I have a separate piece of code that works
    //to ping our database and retreive the UUID.  But I'm not sure how to incorporate it such that it runs before the call to our
    //REST endpoint, which in turn has to run before the it block with the test case/assertion.
    getSigEndpointByUUID(UUID)
    it('Response has status 200', function() {
        res.should.have.status(200);
    });
});


function getSigEndpointByUUID(ID) {
    before(function(done) {
        chai.request(server)
            .get('/esof/api/v1.0/system/signatures/'+ID+'?userId=user')
            .auth('system','password')
            .end(function(err, res) {
                response = res;
                done();
            });
    });
}