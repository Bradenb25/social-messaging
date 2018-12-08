const express = require('express');
const userRouter = express.Router();
var bodyParser = require('body-parser');
var query = require('../main_functions/query');
var constants = require('../constants');
var jwt = require('jwt-simple');
var fs = require('fs');
var path = require('path');
const IncomingForm = require('formidable').IncomingForm;

userRouter.use(bodyParser.json());

userRouter.post('/login', (req, res) => {
    var userData = req.body;
    console.log('trying to login');
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

            console.log('sending back token');

            let token = jwt.encode(payload, '123', 'HS256');

            let response = {
                jwtToken: token,
                expiration: new Date(),
                userName,
                isAuthenticated: true,
                name: result[0].first_name,
                id: result[0].id
            };

            console.log(response);

            res.status(200).send(response);
            res.end();
        }
    });
});

userRouter.get('/user/profile-pic/default', function (req, res) {
    res.status(200).contentType('image/png').sendFile('default.jpg', {
        root: path.join(__dirname, '../profile-pics/')
    }, function (err) {
        if (err) {
            console.log(err);
        } 
    });  
});

userRouter.get('/user/profile-pic', function (req, res) {

    let userName = req.query.username;
    let fileName = './profile-pics/' + userName + '.jpg';

    // console.log(fileName);
    let userProfilePic = userName + '.jpg';

    fs.exists(fileName, function (exists) {
        if (exists) {

            // console.log('Sending back file ' + userProfilePic);
            res.status(200).contentType('image/png').sendFile(userProfilePic, {
                root: path.join(__dirname, '../profile-pics/')
            }, function (err) {
                if (err) {
                    console.log(err);
                }
            });
 
        } else {
            console.log(userName);
            query(`SELECT picture, username FROM users WHERE username = '${userName}';`,
                function (err, readResult) {
                    if (readResult.rows && readResult.rows.length > 0) {
                        console.log('Sending back file 6 ' + userProfilePic);

                        fileName = `./profile-pics/${readResult.rows[0].username}.jpg`;
                        userName = readResult.rows[0].username + '.jpg';

                        fs.writeFile(fileName, readResult.rows[0].picture, function (err) {
                            res.status(200).sendFile(userProfilePic, {
                                root: path.join(__dirname, '../profile-pics/')
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

userRouter.post(
    "/user/profile-pic", function (req, res) {
        let token = req.headers.authorization.replace('Bearer ', '');

        let userCred = jwt.decode(token, '123', 'HS256');
        console.log("made it into upload");
        var form = new IncomingForm();
        form.on('file', (field, file) => {
            console.log("The file is " + file.path);
            fs.readFile(file.path, 'hex', function (err, imgData) {
                // console.log('imgData', imgData);
                imgData = '\\x' + imgData;
                query('UPDATE users SET picture = ($1) WHERE id = $2',
                    [imgData, userCred.userId],
                    function (err, writeResult) {
                        console.log('err', err, 'pg writeResult', writeResult);
                    });
            });
            // Do something with the file
            // e.g. save it to the database
            // you can access it using file.path
        });
        form.on('end', () => {
            res.json();
        });
        form.parse(req);
    });


userRouter.post('/user', function (req, res) {
    var user = req.body;
    query(constants.CREATE_USER,
        [user.email, user.userName, user.password, user.firstName],
        function (err, result) {
            if (err) {
                res.status(422).end();
            } else {
                let userName = user.userName;
                let payload = {
                    userName: userName,
                    expiration: new Date(),
                    userId: result[0].id
                };

                console.log('sending back token');
                let token = jwt.encode(payload, '123', 'HS256');

                res.status(200).send({
                    jwtToken: token,
                    expiration: new Date(),
                    userName,
                    isAuthenticated: true
                });
                res.end();
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
    // console.log(userName);
    // console.log(constants.GET_USERS_BY_NAME)
    let token = req.headers.authorization.replace('Bearer ', '');
    let userCred = jwt.decode(token, '123', 'HS256');
    query(constants.GET_USERS_BY_NAME,
        ['%' + userName + '%', userCred.userId],
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
    query(constants.UPDATE_USER, [user.email, user.firstName, user.userName], function (err, result) {
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

