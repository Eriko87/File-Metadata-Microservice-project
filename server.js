'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const multer  = require('multer')

//connect to DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, (error, client) => {
	console.log("Successfully connected to MongoDB");
})

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });


// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  let filename=file.originalname
  let type = file.mimetype
  let size = file.size
    res.send({"name":filename, "type":type,"size":size})
  
})


app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
