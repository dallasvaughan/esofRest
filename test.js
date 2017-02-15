/**
 * Created by josephmiller on 2/15/17.
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
// var db = require('/OracleDB.js');
var server = 'http://localhost:8080';
var response;
var parseRes;

describe('Test Case 1: {status} = empty, {user} = user', function () {
    getSignatureByStatus('', 'user');
    it('Returns active and inactive signatures', function () {
        response.should.have.status(200);
        if (parseRes.length === 0) {
            console.log("No signatures on file.");
        } else {
            parseRes.length.should.be.at.least(1);
            console.log(parseRes.length + ' signature(s) on file:');
            getAllSignatureUUIDs(parseRes);
        }
    });
});


function getSignatureByStatus(filter, user) {
    before(function(done) {
        chai.request(server)
            .get('/esof/api/v1.0/system/signatures/'+filter+'?userId='+user)
            .auth('system', 'password')
            .end(function (err, res) {
                response = res;
                console.log(res);
                parseRes = JSON.parse(res.text);
                done();
            });
    });
}

function getAllSignatureUUIDs(JSON) {
    for (let i = 0; i < JSON.length; i++) {
        if (JSON[i].status === 'ACTIVE') {
            console.log('  ACTIVE signature UUID = ' + JSON[i].signatureIdentifier);
        } else if (JSON[i].status === 'INACTIVE') {
            console.log('INACTIVE signature UUID = ' + JSON[i].signatureIdentifier);
        }
    }
}