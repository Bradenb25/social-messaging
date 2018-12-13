const express = require('express');
const friendsRouter = express.Router();
var bodyParser = require('body-parser');
var query = require('../main_functions/query');
var constants = require('../constants');
var jwt = require('jwt-simple');

friendsRouter.post('/friend', function (req, res) {
    // Add logic to make sure the there is a request for it
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.ADD_FRIEND, [userCred.userId, req.body.friendId], function(err, result) {
        if (err) {
            res.status(422).end();
        } else {
            res.status(201).end();   
        }
    })
});

friendsRouter.get('/friends', function (req, res) {
    // var user = req;
    console.log('In friends');
    let token = req.headers.authorization.replace('Bearer ', ''); 
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.GET_USERS_FRIENDS,
        [userCred.userId],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                let friends = new Array();
                for (let i = 0; i < result.length; i++) {
                    friends.push(Object.assign({}, {
                        id: result[i].id,
                        email: result[i].email,
                        username: result[i].username,
                        name: result[i].first_name
                    }))
                }
                // console.log(JSON.stringify(friends));
 
                res.status(200).json(friends).end();
            }
        })
});

friendsRouter.delete('/friends', function (req, res) {
    // Add logic to make sure people are already friends and the requester
    // is the requester
    console.log('trying to delete user with id ' + req.query.id);
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');
    console.log('deleting friend from user ' + userCred.userId);
    query(constants.DELETE_FRIEND, [userCred.userId, req.query.id], function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.status(200).end();
        }
    })
});

friendsRouter.post('/friend/request', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');
    console.log(userCred.userId);
    console.log(req.body.userId);
    query(constants.CREATE_FRIEND_REQUEST, 
        [userCred.userId, req.body.userId], 
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(201).end();
            }
    });
});

friendsRouter.get('/friend/request', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.GET_FRIEND_REQUESTS, [userCred.userId], function (err, result) {
        if (err) {
            res.status(404).end();
        } else { 
            res.status(200).json(result).end();
        }
    });
});

friendsRouter.delete('/friend/request', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.DELETE_FRIEND_REQUEST, 
        [req.query.id, userCred.userId], 
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).end();
            }
        });
});

module.exports = friendsRouter;

// var express = require('express');
// var router = express.Router();

// router.get('/', function (req, res) {
//     console.log("made it to friends");
// });

// module.exports = router;