/**
 * Created by josephmiller on 2/14/17.
 */
var oracledb = require('oracledb');


getSigFromDB(function(callback) {
    console.log(callback);
});

function getSigFromDB(callback) {
    oracledb.getConnection(
        {
            user: "user",
            password: "password",
            connectString: "connectString"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.execute(
                "SELECT SIGNATURE_IDENTIFIER " +
                "FROM SIGNATURE " +
                "WHERE STATUS = 'ACTIVE'",
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    doRelease(connection);
                    var res = result.rows[0][0];
                    callback(res);
                });
        });
};

function doRelease(connection) {
    connection.close(
        function(err) {
            if (err)
                console.error(err.message);
        });
}
