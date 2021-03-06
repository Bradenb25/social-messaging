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
var todoRoutes = require('./routes/todo');

var path = require("path");

var storage = multer.memoryStorage()
// var upload = multer({storage: storage});
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(express.static('profile-pics'));
app.use(express.static(__dirname + '/html'));

app.use('/api/', friendRoutes);
app.use('/api/', postRoutes);
app.use('/api/', userRoutes);
app.use('/api/', groupRoutes);
app.use('/api/', messagesRoutes);
app.use('/api/', todoRoutes);



app.get('', function (req, res) {
    res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.get('*/', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/index.html'));
})

app.listen(PORT);
console.log("listening on " + PORT);