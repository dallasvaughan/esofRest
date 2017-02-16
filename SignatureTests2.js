//Trying to write a small test that hits our REST endpoint /esof/api/v1.0/system/signatures/{UUID}?userId=user.
//MochaJS is the test framework (describe/it), chai & chaiHttp to make requests, oracledb to grab data from database.

//In Mocha, anything with the before() hook like getSignatureByUUID is run before anything in an 'it' block.
var oracledb = require('oracledb');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
var server = 'http://localhost:8080';

describe('GET /esof/api/v1.0/system/signatures/{UUID}?userId=user', function() {
    //Here's where my issue is.  I need to define UUID to pass into getSignatureByUUID.  I have a separate piece of code that works
    //to ping our database and retreive the UUID.  But I'm not sure how to incorporate it such that it runs before the call to our
    //REST endpoint, which in turn has to run before the it block with the test case/assertion.
    var conn;

    //runs once for this entire block to populate UUID of signature we will test
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
    )});

    it('Response has status 200', function(done) {
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

    it('Response has status 200 2', function(done) {
        conn.execute(
            "SELECT SIGNATURE_IDENTIFIER " +
            "FROM SIGNATURE " +
            "WHERE STATUS = 'ACTIVE' AND USER_ID = 'user2'",
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    return;
                }
                var uuid = result.rows[0][0];
                console.log("user2 uuid: " + uuid);

                chai.request(server)
                    .get('/esof/api/v1.0/system/signatures/'+uuid+'?userId=user2')
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
    })
});

function doRelease(connection) {
    connection.close(
        function(err) {
            if (err)
                console.error(err.message);
        });

}