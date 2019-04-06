const express = require("express");
var mysql = require("mysql");

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

const database = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "back2Auenland",
    database: "m300"
});

database.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// App
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    database.query("select * from data", function(err, result) {
        if (err) throw err;
        console.log("Result: " + result);
        res.json({ hello: "World", result: result });
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
