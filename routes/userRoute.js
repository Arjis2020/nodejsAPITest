const express = require('express');
const userRoutes = express.Router();
const mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',   //use your php myadmin root
    password: '',   //use your php myadmin password
    database: 'nodeapitest' //first create this database or the app will crash
});

db.connect((err, response) => {
    if (err) throw err;
    console.log("Database connected");
});

//finding users using their respective id (if present) or returning all users
userRoutes.get('/users', (req, res) => {
    if (req.query.id) {
        var sql = 'SELECT * FROM `userinfo` WHERE `id` = ?';
        var id = req.query.id;
        db.query(sql, id, (err, response) => {
            if (err) throw err;
            res.send(response);
        });
    }
    else {
        var sql = 'SELECT * FROM `userinfo`';
        db.query(sql, (err, response) => {
            if (err) throw err;
            res.send(response);
        });
    }



});

//adding a new user to db
userRoutes.post('/users/addUser', (req, res) => {
    let sql = 'INSERT INTO userinfo SET ?';
    let newUser = { name: req.body.name, age: req.body.age, bio: req.body.bio };
    db.query(sql, newUser, (err, response) => {
        if (err) throw err;
        res.send(response);
    });

});

//deleting user account
userRoutes.delete('/users/deleteUser', (req, res) => {
    let sql = `DELETE FROM userinfo WHERE id = ${req.query.id}`;
    db.query(sql, (err, response) => {
        if (err) throw err;
        res.send(response);
    });
});

//updating a user account
userRoutes.put('/users/updateUser', (req, res) => {
    var sql = `UPDATE userinfo SET name = '${req.body.name}', age = '${req.body.age}', bio = '${req.body.bio}' WHERE id = '${req.query.id}'`;

    db.query(sql, (err, response) => {
        if (err) throw err;
        res.send(response);
    });
});

module.exports = userRoutes;