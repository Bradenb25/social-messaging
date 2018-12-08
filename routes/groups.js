const express = require('express');
const groupRouter = express.Router();
var bodyParser = require('body-parser');
var query = require('../main_functions/query');
var constants = require('../constants');
var jwt = require('jwt-simple');
var fs = require('fs');
var path = require("path");

groupRouter.post('/group', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    var group = req.body;

    query(constants.CREATE_GROUP,
        [group.name, group.type, userCred.userId, group.description],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(201).json(result).end();
            }
        })
});

groupRouter.get('/group', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');
    // TODO authenticate user is part of that group or that the 
    // group is an open group.
    query(constants.GET_GROUP, [req.query.groupId],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).json(result).end();
            }
        })
});

groupRouter.post('/group/pic', function (req, res) {
    let groupId = req.query.groupId;
    var form = new IncomingForm();
    console.log('trying to upload photo');
    console.log('group id is ' + groupId);
    form.on('file', (field, file) => {
        console.log("The file is " + file.path);
        fs.readFile(file.path, 'hex', function (err, imgData) {
            console.log(err);
            imgData = '\\x' + imgData; 
            query(constants.UPDATE_GROUP_PIC, [imgData, groupId],
                function (err, writeResult) {
                    console.log('err', err, 'pg writeResult', writeResult);
                });
        });
    });   
    form.on('end', () => {
        res.json();
    });
    form.parse(req);  
});

groupRouter.get('/group/pic', function (req, res) {
    let groupId = req.query.groupId; 
    let fileName = './group-pics/' + groupId + '.jpg';
    let groupPic = groupId + '.jpg';

    fs.exists(fileName, function (exists) {
        if (exists) {
            res.status(200).contentType('image/png').sendFile(groupPic, {
                root: path.join(__dirname, '../group-pics/')
            }, function (err) {
                if (err) {
                    console.log(err);
                }
            });

        } else {
            query(constants.GET_GROUP_PIC, [groupId],
                function (err, readResult) {
                    console.log('grou pic is ');
                    console.log(readResult);
                    console.log(readResult.length);
                    if (readResult && readResult.length > 0) {

                        fs.writeFile(fileName, readResult[0].picture, function (err) {
                            res.status(200).sendFile(groupPic, {
                                root: path.join(__dirname, '../group-pics/')
                            }, function (err) {
                                if (err) {
                                    
                                    console.log(err);
                                }
                            });
                        });
                    } else {
                        res.status(404).end();
                    }
                });
        }
    })
});

groupRouter.put('/group', function (req, res) {
    let group = req.body;

    query(constants.UPDATE_GROUP,
        [group.name, group.group_type_id, group.owner, group.description, group.id],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(200).json(result).end();
            }
        })
})

groupRouter.delete('/group', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.DELETE_GROUP, [req.query.id, userCred.userId],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).end();
            }
        })
})

groupRouter.get('/group/search', function (req, res) {
    var groupName = req.query.name;
    console.log(constants.GET_GROUPS)
    query(constants.GET_GROUPS,
        ['%' + groupName + '%'],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(200).json(result).end();
            }
        })
});

groupRouter.post('/group/user', function (req, res) {
    let groupLookup = req.body;
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.ADD_USER_TO_GROUP, [groupLookup.id, userCred.userId, groupLookup.userType],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(201).end();
            }
        });
});

groupRouter.delete('/group/user', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.REMOVE_USER_FROM_GROUP, [req.query.id, userCred.userId],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).end();
            }
        })
});

groupRouter.get('/group/users', function (req, res) {
    // TODO authentication to make sure the person is a part of the group
    // or if the group is open
    query(constants.GET_USERS_BY_GROUP, [req.query.id],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).json(result).end();
            }
        })
});

groupRouter.post('/group/request', function (req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.CREATE_REQUEST_TO_JOIN_GROUP, [userCred.userId, req.body.groupId],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                res.status(201).end();
            }
        });
});

groupRouter.get('/group/request', function (req, res) {
    // TODO add logic to only allow owner to see them
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.GET_JOIN_REQUESTS_FOR_GROUP, [req.query.id],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).json(result).end();
            }
        });
});

groupRouter.delete('/group/request', function (req, res) {
    // TODO add logic to only allow owner to see them
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');

    query(constants.DELETE_JOIN_REQUEST, [req.query.id],
        function (err, result) {
            if (err) {
                res.status(404).end();
            } else {
                res.status(200).end();
            }
        })
});

groupRouter.get('/group/types', function (req, res) {
    query(constants.GET_GROUP_TYPES, [], function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.status(200).json(result).end();
        }
    });
})

module.exports = groupRouter