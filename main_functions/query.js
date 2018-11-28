const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || `postgres://ucdqjbtgilqbrq:700f17843b435c45cd6b142b6b7915b8579afdcb409459deffc6069573c72dc1@ec2-54-83-8-246.compute-1.amazonaws.com:5432/d8vr09dab2h4vm`;
const pool = new Pool({ connectionString: connectionString, ssl: true });

var runQuery = function runQuery(query, params, callback) {
    pool.query(query, params, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            console.log('got the rows', result.rows);
            callback(err, result.rows);
        }
    });
}; 

module.exports = runQuery;

