const express = require('express');
const userRouter = express.Router();
var bodyParser = require('body-parser');
var query = require('../main_functions/query');
var constants = require('../constants');
var jwt = require('jwt-simple');

userRouter.use(bodyParser.json());

userRouter.post('/login', (req, res) => {
    var userData = req.body;
    query(constants.GET_USER_BY_NAME, [userData.userName], function (err, result) {
        if (err) {
            res.status(404);
        } else {             
            let userName = userData.userName;
            let payload = {
                userName: userData.userName, 
                expiration: new Date(),  
                userId: result[0].id
            };

            let token = jwt.encode(payload, '123', 'HS256');

            res.status(200).send({ 
                jwtToken: token, 
                expiration: new Date(), 
                userName,
                isAuthenticated: true
             });
            res.end();
        }
    });
});

userRouter.post('/user', function (req, res) {
    var user = req.body;
    query(constants.CREATE_USER,
        [user.email, user.userName, user.password, user.firstName],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(201).json(result).end();
            }
        })
})

userRouter.get('/user', function (req, res) {
    var userName = req.query.name;
    query(constants.GET_USER_BY_NAME,
        [userName],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(200).json(result).end();
            }
        })
})

userRouter.get('/user/search', function (req, res) {
    var userName = req.query.name;
    console.log(userName);
    console.log(constants.GET_USERS_BY_NAME)
    query(constants.GET_USERS_BY_NAME,
        ['%' + userName + '%'],
        function (err, result) { 
            if (err) {
                res.status(422).end();
            } else {
                res.status(200).json(result).end();
            }
        })
});


userRouter.put('/user', function (req, res) {
    var user = req.body;
    query(constants.UPDATE_USER, [user.email, user.firstName, user.userName], function(err, result) {
        if (err) {
            res.status(422).end();
        } else {
            res.status(200).json(result).end();
        }
    })
});

userRouter.delete('/user', function (req, res) {
    var id = req.query.id;
    query(constants.DELETE_USER, [id], function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.status(200).end();
        }
    })
})

module.exports = userRouter;