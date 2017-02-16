var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
var oracledb = require('oracledb');
var server = 'http://localhost:8080';
var uuid;

describe('GET /esof/api/v1.0/system/signatures/{status}?userId={user}', function() {
    describe('Test Case 1: /esof/api/v1.0/system/signatures/?userId=user', function () {
        it('Returns status 200', function(done) {
            chai.request(server)
                .get('/esof/api/v1.0/system/signatures/?userId=user')
                .auth('system', 'password')
                .end(function (err, res) {
                    res.should.have.status(200);
                    if (JSON.parse(res.text).length === 0) {
                        console.log("No signatures on file.")
                    } else {
                        JSON.parse(res.text).length.should.be.at.least(1);
                    }
                    done();
                });
        });
    });

    describe('Test Case 2: /esof/api/v1.0/system/signatures/active?userId=user', function () {
        it('Returns status 200', function(done) {
            chai.request(server)
                .get('/esof/api/v1.0/system/signatures/active?userId=user')
                .auth('system', 'password')
                .end(function (err, res) {
                    res.should.have.status(200);
                    if (JSON.parse(res.text).length === 0) {
                        console.log("No signatures on file.")
                    } else {
                        JSON.parse(res.text).length.should.equal(1);
                    }
                    done();
                });
        });
    });

    describe('Test Case 3: /esof/api/v1.0/system/signatures/inactive?userId=user', function () {
        it('Returns status 200', function(done) {
            chai.request(server)
                .get('/esof/api/v1.0/system/signatures/inactive?userId=user')
                .auth('system', 'password')
                .end(function (err, res) {
                    res.should.have.status(200);
                    if (JSON.parse(res.text).length === 0) {
                        console.log("No signatures on file.")
                    } else {
                        JSON.parse(res.text).length.should.be.at.least(1);
                    }
                    done();
                });
        });
    });

    describe('Test Case 4: /esof/api/v1.0/system/signatures/invalidStatus?userId=user', function () {
        it('Returns status 404', function(done) {
            chai.request(server)
                .get('/esof/api/v1.0/system/signatures/invalidStatus?userId=user')
                .auth('system', 'password')
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('Test Case 5: /esof/api/v1.0/system/signatures/?userId=invalidUser', function () {
        it('Returns status 200, empty response body', function(done) {
            chai.request(server)
                .get('/esof/api/v1.0/system/signatures/?userId=invalidUser')
                .auth('system', 'password')
                .end(function (err, res) {
                    res.should.have.status(200);
                    JSON.parse(res.text).should.be.empty;
                    done();
                });
        });
    });

    describe('Test Case 6: /esof/api/v1.0/system/signatures/active?userId=', function () {
        it('Returns status 200, empty response body', function(done) {
            chai.request(server)
                .get('/esof/api/v1.0/system/signatures/active?userId=')
                .auth('system', 'password')
                .end(function (err, res) {
                    res.should.have.status(200);
                    JSON.parse(res.text).should.be.empty;
                    done();
                });
        });
    });
});

describe('GET /esof/api/v1.0/system/signatures/{UUID}?userId={user}', function() {
    describe('Test Case 1: /esof/api/v1.0/system/signatures/{userValidUUID}?userId=user', function () {
        getSigUUIDFromDB('user');
        it('Response has status 200', function(done) {
            chai.request(server)
                .get('/esof/api/v1.0/system/signatures/'+uuid+'?userId=user')
                .auth('system','password')
                .end(function(err, res) {
                    console.log(res);
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

function getSigUUIDFromDB(user) {
    before(function (done) {
        oracledb.getConnection(
            {
                user: "esofds",
                password: "esofdspassword",
                connectString: "local.db.des.usps.com:1521/XE"
            },
            function (err, connection) {
                if (err) {
                    console.error(err.message);
                    return;
                }
                connection.execute(
                    "SELECT SIGNATURE_IDENTIFIER " +
                    "FROM SIGNATURE " +
                    "WHERE USER_ID = '" + user + "' AND STATUS = 'ACTIVE'",
                    function (err, result) {
                        if (err) {
                            console.error(err.message);
                            doRelease(connection);
                            return;
                        }
                        doRelease(connection);
                        uuid = result.rows[0][0];
                        done();
                    }
                )
            });
    });
}
function doRelease(connection) {
    connection.close(
        function(err) {
            if (err)
                console.error(err.message);
        });
}