var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
var oracledb = require('oracledb');
var server = 'http://localhost:8080';

//Vary the {status} parameter
describe('GET /esof/api/v1.0/system/signatures/{status}?userId=user', function() {
    it('Test Case 1: /esof/api/v1.0/system/signatures/?userId=user', function (done) {
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
    it('Test Case 2: /esof/api/v1.0/system/signatures/active?userId=user', function (done) {
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
    it('Test Case 3: /esof/api/v1.0/system/signatures/inactive?userId=user', function (done) {
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

//Vary the {user} parameter
describe('GET /esof/api/v1.0/system/signatures?userId={user}', function() {
    it('Test Case 1: /esof/api/v1.0/system/signatures/invalidStatus?userId=user', function(done) {
        chai.request(server)
            .get('/esof/api/v1.0/system/signatures/invalidStatus?userId=user')
            .auth('system', 'password')
            .end(function (err, res) {
                res.should.have.status(404);
                done();
            });
    });
    it('Test Case 2: /esof/api/v1.0/system/signatures/?userId=invalidUser', function(done) {
        chai.request(server)
            .get('/esof/api/v1.0/system/signatures/?userId=invalidUser')
            .auth('system', 'password')
            .end(function (err, res) {
                res.should.have.status(200);
                JSON.parse(res.text).should.be.empty;
                done();
            });
    });
    it('Test Case 3: /esof/api/v1.0/system/signatures/active?userId=', function(done) {
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

//Vary the {UUID} parameter
describe('GET /esof/api/v1.0/system/signatures/{UUID}?userId={user}', function() {
    var conn;

    before(function(done) {
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
                conn = connection;
                done();
            }
        )
    });

    it('Test Case 1: /esof/api/v1.0/system/signatures/{userValidUUID}?userId=user', function(done) {
        conn.execute(
            "SELECT SIGNATURE_IDENTIFIER " +
            "FROM SIGNATURE " +
            "WHERE STATUS = 'ACTIVE' AND USER_ID = 'user'",
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    return;
                }
                var uuid = result.rows[0][0];
                console.log("user uuid: " + uuid);

                chai.request(server)
                    .get('/esof/api/v1.0/system/signatures/'+uuid+'?userId=user')
                    .auth('system','password')
                    .end(function(err, res) {
                        res.should.have.status(200);
                        done();
                    });
            }
        );
    });

    after(function(done) {
        doRelease(conn);
        done();
    });

});

function doRelease(connection) {
    connection.close(
        function(err) {
            if (err)
                console.error(err.message);
        });
}