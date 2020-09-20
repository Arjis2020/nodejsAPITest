const express = require('express');
const routes = express.Router();
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const randomString = require('randomstring');
const fs = require('fs');

//storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, randomString.generate({
            length: 24,
            charset: 'alphanumeric'
        }) + path.extname(file.originalname));
    }
});

//init uploading procedure
const upload = multer({
    storage: storage,
}).single('video');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', //use your php myadmin root
    password: '',   //use your php myadmin password
    database: 'nodeapitest' //first create this database or the app will crash
});

db.connect((err, response) => {
    if (err) throw err;
    console.log("Database connected");
});

//getting all videos of a single user
routes.get('/videos', (req, res) => {
    var sql = 'SELECT * FROM `userVideos` WHERE userID = ?';
    var id = req.query.id;
    db.query(sql, id, (err, response) => {
        if (err) throw err;
        res.send(response);
    });
});

//uploading a video with a specific userID
routes.post('/uploadVideo', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            let sql = 'INSERT INTO userVideos SET ?';
            let newVideo = {
                videoID: '#' + req.query.id + '_' + randomString.generate({
                    length: 6,
                    charset: 'alphanumeric'
                }), userID: req.query.id, videoName: req.file.filename, videoPath: req.file.path
            };
            db.query(sql, newVideo, (err, response) => {
                if (err) throw err;
                res.send(response);
            });
        }
    });
});

//deleting a video with the videoID
routes.delete('/deleteVideo', (req, res) => {
    let sql = 'DELETE FROM `userVideos` WHERE videoID = ?';
    var getPathFromDB = 'SELECT * FROM `userVideos` WHERE videoID = ?';
    let videoID = req.query.videoID;
    var videoPath = {};
    var path = '';

    //getting the videoName to delete the video from local storage as well
    db.query(getPathFromDB, videoID, (err, response) => {
        if (err) throw err;
        videoPath = response[0];
        for (const [key, value] of Object.entries(videoPath)) {
            if (`${key}` == 'videoName') {
                path = `${value}`;
            }
        }
    });

    //going ahead and deleting the video both from local storage and mysql database
    db.query(sql, videoID, (err, response) => {
        if (err) throw err;
        fs.unlink('./public/uploads/' + path, (err) => {
            if (err) throw err;
        });
        res.send(response);
    });
});


module.exports = routes;