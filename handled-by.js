var fs = require("fs");
var path = require("path");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var handledBy = process.cwd();

function handledByGet() {
    return handledBy;
}
exports.handledByGet = handledByGet;

try {
    var instanceInfo = require(path.join(process.cwd(), "..", "..", "instance.js"));
} catch(e) {
    return;
}

var url = "mongodb://localhost:27017/cycligent";

MongoClient.connect(url, function(err, db) {
    if (err) {
        console.error("Error connecting to MongoDB:");
        console.error(err);
        return;
    }

    db.collection("roleProcesses", {strict: false}, function(err, collection) {
        if (err) {
            console.error("Error connecting to roleProcesses collection:");
            console.error(err);
            return;
        }

        collection.find({_id: new mongodb.ObjectID(instanceInfo.roleProcess_id)}).toArray(function(err, docs) {
            if (err) {
                console.error("Error querying the roleProcesses collection:");
                console.error(err);
                return;
            }

            if (docs.length !== 1) {
                console.error("Unable to find roleProcess document.");
                console.error(err);
                return;
            }

            var roleProcess = docs[0];
            var workerType = roleProcess.workerType;

            if (!roleProcess.workerType) {
                if (roleProcess.roleType === "worker") {
                    workerType = "standard";
                } else if (roleProcess.roleType === "longWorker") {
                    workerType = "long";
                } else {
                    workerType = "Unknown";
                }
            }

            handledBy = roleProcess.friendlyName + " (" + workerType + ")";

            db.close();
        });
    });
});