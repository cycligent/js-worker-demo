var fs = require("fs");
var path = require("path");

var express = require('express');

var app = express();
var port = process.env.PORT || 3000;
var computeAndCompare = require("./calculate-pi.js").computeAndCompare;
var serverTimeGet = require("./server-time.js").serverTimeGet;

app.use(express.static(path.join(__dirname, "static")));

app.get('/compute-pi', function(req, res) {
    computeAndCompare(parseInt(req.query.precision) || 1, function(result) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.get("/server-time", function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(serverTimeGet()));
});

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});