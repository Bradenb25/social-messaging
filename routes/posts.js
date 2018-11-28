const express = require('express');
const postRouter = express.Router();
var bodyParser = require('body-parser');
var query = require('../main_functions/query');
var constants = require('../constants');

postRouter.use(bodyParser.json());

postRouter.post('/post', function (req, res) {
    var post = req.body;
    console.log(constants.CREATE_POST);
    query(
        constants.CREATE_POST,
        [post.time, post.groupId, post.posterId, post.content],
        function (err, result) {
            if (err) {

            } else {
                console.log(result);
                res.status(201).json(result);
                res.end();
            }
        });
});

postRouter.get('/post', function (req, res) {
    var groupName = req.query.group_name;
    console.log(groupName);
    console.log(constants.GET_POSTS);
    query(constants.GET_POSTS, [groupName],

        function (err, result) {
            if (err) {

            } else {
                console.log(result);
                res.status(200).json(result);
                res.end();
            }
        });
});

postRouter.put('/post', function (req, res) {
    var post = req.body;
    query(constants.UPDATE_POST, [post.content, post.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(404).end();
        } else {
            res.status(200).json(result);
            res.end();
        }
    })
});

postRouter.delete('/post', function (req, res) {
    var id = req.query.id;
    query(constants.DELETE_POST, [id], function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.status(200).end();
        }
    })
});

postRouter.post('/post/comment', function (req, res) {
    var postComment = req.body;
    query(
        constants.CREATE_POST_COMMENT,
        [postComment.content, postComment.postId, postComment.posterId, postComment.time],
        function (err, result) {
            if (err) {
                res.status(403).end();
            } else {
                res.status(201).end();
            }
        })
});

postRouter.get('/post/comment', function (req, res) {
    var id = req.query.id;
    query(constants.GET_COMMENTS_FOR_POST, [id], function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.status(200)
                .json(result)
                .end();
        }
    });
});

postRouter.put('/post/comment', function (req, res) {
    var postComment = req.body;
    query(
        constants.UPDATE_COMMENT,
        [postComment.content, postComment.id, postComment.postId],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(200).end();
            }
        })
});

postRouter.delete('/post/comment', function (req, res) {
    var id = req.query.id;
    query(
        constants.DELETE_COMMENT,
        [id],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(200).end();
            }
        })
});


module.exports = postRouter;