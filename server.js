var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 4280;
const multer = require('multer');
var app = express();
var fs = require('fs');

var jwt = require('jwt-simple');

var query = require('./main_functions/query');

const IncomingForm = require('formidable').IncomingForm;

var friendRoutes = require('./routes/friends');
var postRoutes = require('./routes/posts');
var userRoutes = require('./routes/user');
var groupRoutes = require('./routes/groups');
var messagesRoutes = require('./routes/messages');

var path = require("path");

var storage = multer.memoryStorage()
// var upload = multer({storage: storage});
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(express.static('profile-pics'));
app.use(express.static(__dirname + '/html'));

app.use('/', friendRoutes);
app.use('/', postRoutes);
app.use('/', userRoutes);
app.use('/', groupRoutes);
app.use('/', messagesRoutes);


app.post(
    "/upload", function (req, res) {
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

app.get('', function (req, res) {
    res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.get('*/', function (req, res) {
    res.redirect('/')
})

app.listen(PORT);
console.log("listening on " + PORT);