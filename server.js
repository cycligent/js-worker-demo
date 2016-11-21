var fs = require("fs");
var path = require("path");

var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
var port = process.env.PORT || 3000;
var handledByGetAll = require("./handled-by.js").handledByGetAll;
var computeAndCompare = require("./calculate-pi.js").computeAndCompare;
var serverTimeGet = require("./server-time.js").serverTimeGet;
var versionTypesGet = require("./version-types.js").versionTypesGet;

app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());

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

app.get("/version-types", function(req, res) {
    versionTypesGet(function(result) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.get("/handled-by", function(req, res) {
    var data = handledByGetAll();
    if (data.isDefault && req.cookies && req.cookies.versionType) {
        data.versionType = req.cookies.versionType;
    }

    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
});

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});