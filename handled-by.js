var fs = require("fs");
var path = require("path");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var handledBy = process.cwd();
var handledByAllInfo = {
    deploymentName: "aws",
    friendlyName: "prod-worker-00",
    roleSpec_id: "000000000000000000000000",
    machine_id: "000000000000000000000000",
    set_id: "000000000000000000000000",
    roleType: "worker",
    version: "0.0.0",
    versionType: "prod",
    urls: ["http://localhost:3000"],
    size: "t2.nano",
    status: {
        major: "Online",
        minor: "Healthy",
        setByCyvisor: false,
        cpuSamples: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        memSamples: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        memTotal: 1,
        responseTimeSamples: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        networkTrafficSamples: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        probeCount: 0,
        modAt: new Date()
    },
    modAt: new Date(),
    modVersion: 0,
    isDefault: true
};

function handledByGetStr() {
    return handledBy;
}
exports.handledByGetStr = handledByGetStr;

function handledByGetAll() {
    return JSON.parse(JSON.stringify(handledByAllInfo));
}
exports.handledByGetAll = handledByGetAll;

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
            handledByAllInfo = roleProcess;

            if (!roleProcess.workerType) {
                if (roleProcess.roleType === "worker") {
                    roleProcess.workerType = "standard";
                } else if (roleProcess.roleType === "longWorker") {
                    roleProcess.workerType = "long";
                } else {
                    roleProcess.workerType = "Unknown";
                }
            }

            handledBy = roleProcess.friendlyName + " (" + roleProcess.workerType + ")";

            db.close();
        });
    });
});