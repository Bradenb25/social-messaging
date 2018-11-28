const express = require('express');
const messagesRouter = express.Router();
var bodyParser = require('body-parser');
var query = require('../main_functions/query');
var constants = require('../constants');
var jwt = require('jwt-simple');

messagesRouter.post('/message', function (req, res) {
    var message = req.body;
    query(constants.CREATE_MESSAGE,
        [message.content, message.from, message.to, message.time_sent],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(201).json(result).end();
            }
        })
});

messagesRouter.get('/message', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.GET_MESSAGES,
        [userCred.userId],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).json(result).end();
            }
        })
});

messagesRouter.get('/message/convo', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.GET_CONVERSATIONS, [userCred.userId],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).json(result).end();
            }
        });
});

messagesRouter.put('/message', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');
    
    var message = req.body;

    query(constants.UPDATE_MESSAGE, 
        [message.content, userCred.userId, message.id],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(200).json(result).end();
            }
        });
});

messagesRouter.delete('/message', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');
    let messageId = req.query.id;

    query(constants.DELETE_MESSAGE, [messageId, userCred],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).end();
            }
        });
})

module.exports = messagesRouter;