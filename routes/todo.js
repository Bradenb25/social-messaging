const express = require('express');
const todoRouter = express.Router();
var bodyParser = require('body-parser');
var query = require('../main_functions/query');
var constants = require('../constants');
var jwt = require('jwt-simple');
var fs = require('fs');
var path = require("path");
const IncomingForm = require('formidable').IncomingForm;

todoRouter.post('/todo', function (req, res) {
    let todo = req.body;

    query(constants.CREATE_TODO_ITEM, [todo.item, false], function (err, result) {
        if (err) {
            res.status(422).end();
        } else {
            res.status(201).end();
        }
    })
});

todoRouter.get('/todo', function (req, res) {
    // var user = req;

    query(constants.GET_TODO_ITEMS, [], function (err, result) {
        // console.log(result);
        if (err) {
            res.status(404).end();
        } else {

            res.status(200).json(result).end();
        }
    })
});

todoRouter.put('/todo', function (req, res) {    
    let todo = req.body;
    
    query(constants.UPDATE_TODO_ITEM, [todo.completed, todo.id], function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.status(200).end();
        }
    })
});

module.exports = todoRouter;