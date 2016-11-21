var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var handledByGetStr = require('./handled-by.js').handledByGetStr;

var url = "mongodb://localhost:27017/cycligent";

function versionTypesGet(callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.error("Error connecting to MongoDB:");
            console.error(err);

            callback({
                success: false,
                error: "Error getting connecting to the database.",
                versionTypes: [],
                handledBy: handledByGetStr()
            });
            return;
        }

        db.collection("roleProcesses", {strict: false}, function(err, collection) {
            if (err) {
                console.error("Error connecting to roleProcesses collection:");
                console.error(err);

                callback({
                    success: false,
                    error: "Error getting the database collection.",
                    versionTypes: [],
                    handledBy: handledByGetStr()
                });
                return;
            }

            collection.find({}).toArray(function(err, docs) {
                if (err) {
                    console.error("Error querying the roleProcesses collection:");
                    console.error(err);

                    callback({
                        success: false,
                        error: "Error querying the database.",
                        versionTypes: [],
                        handledBy: handledByGetStr()
                    });
                    return;
                }

                var versionTypes = [];

                for (var i = 0; i < docs.length; i++) {
                    var doc = docs[i];

                    if (typeof doc.versionType === "string" &&
                        doc.versionType !== "common" &&
                        versionTypes.indexOf(doc.versionType) === -1
                    ) {
                        versionTypes.push(doc.versionType);
                    }
                }

                callback({
                    success: true,
                    versionTypes: versionTypes,
                    handledBy: handledByGetStr()
                });
            });
        });
    });
}
exports.versionTypesGet = versionTypesGet;