var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
var oracledb = require('oracledb');
var server = 'http://localhost:8080';
var response;
var parseRes;

describe('GET /esof/api/v1.0/system/signatures/{status}?userId={user}', function() {
    describe('Test Case 1: {status} = empty, {user} = user', function () {
        getSignatureByStatus('', 'user');
        it('Returns active and inactive signatures', function () {
            response.should.have.status(200);
            if (parseRes.length === 0) {
                console.log("No signatures on file.");
            } else {
                parseRes.length.should.be.at.least(1);
                console.log(parseRes.length + ' signature(s) on file:');
                showSigsAndStatus(parseRes);
            }
        });
    });

    describe('Test Case 2: {status} = active, {user} = user', function () {
        getSignatureByStatus('active', 'user');
        it('Returns active signatures', function () {
            response.should.have.status(200);
            if (parseRes.length === 0) {
                console.log("No active signatures on file.");
            } else {
                parseRes.length.should.equal(1);
                console.log(parseRes.length + ' active signature on file:');
                showSigsAndStatus(parseRes);
            }
        });
    });

    describe('Test Case 3: {status} = inactive, {user} = user', function () {
        getSignatureByStatus('inactive', 'user');
        it('Returns inactive signatures', function () {
            response.should.have.status(200);
            if (parseRes.length === 0) {
                console.log("No inactive signatures on file.");
            } else {
                parseRes.length.should.be.at.least(1);
                console.log(parseRes.length + ' inactive signature(s) on file:');
                showSigsAndStatus(parseRes);
            }
        });
    });

    describe('Test Case 4: {status} = invalidstatus, {user} = user', function() {
        getSignatureByStatus('invalidstatus', 'user');
        it('Returns 404 not found', function () {
            response.should.have.status(404);
        });
    });

    describe('Test Case 5: {status} = empty, {user} = invaliduser', function() {
        getSignatureByStatus('', 'invaliduser');
        it('Returns 200 empty response body', function () {
            response.should.have.status(200);
            parseRes.should.be.empty;
        });
    });

    describe('Test Case 6: {status} = active, {user} = empty', function() {
        getSignatureByStatus('active', '');
        it('Returns 200 empty response body', function () {
            response.should.have.status(200);
            parseRes.should.be.empty;
        });
    });
});

function getSignatureByStatus(filter, user) {
    before(function(done) {
        chai.request(server)
            .get('/esof/api/v1.0/system/signatures/'+filter+'?userId='+user)
            .auth('system', 'password')
            .end(function (err, res) {
                response = res;
                parseRes = JSON.parse(res.text);
                done();
            });
    });
}

function showSigsAndStatus(JSON) {
    for (let i = 0; i < JSON.length; i++) {
        if (JSON[i].status === 'ACTIVE') {
            console.log('  ACTIVE signature UUID = ' + JSON[i].signatureIdentifier);
        } else if (JSON[i].status === 'INACTIVE') {
            console.log('INACTIVE signature UUID = ' + JSON[i].signatureIdentifier);
        }
    }
}