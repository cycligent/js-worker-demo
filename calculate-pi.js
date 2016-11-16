var fs = require("fs");
var path = require("path");

var Decimal = require('decimal.js');
var handledByGet = require('./handled-by.js').handledByGet;
var precomputedPi = JSON.parse(fs.readFileSync(path.join(__dirname, "pi-ten-thousand.json")));

// the Bailey-Borwein-Plouffe formula
// http://stackoverflow.com/questions/4484489/using-basic-arithmetics-for-calculating-pi-with-arbitary-precision
function pi(precision, callback) {
    precision += 10; // Extra precision to make sure we get the last digit right.

    var p16 = new Decimal(1);
    var pi = new Decimal(0);
    Decimal.config({precision: precision});

    var one = new Decimal(1);
    var two = new Decimal(2);
    var four = new Decimal(4);
    var eight = new Decimal(8);

    var k = new Decimal(0);

    function step() {
        pi = pi.plus(
            one.div(p16).times(
                four.div(eight.times(k).plus(1))
                    .minus(two.div(eight.times(k).plus(four)))
                    .minus(one.div(eight.times(k).plus(5)))
                    .minus(one.div(eight.times(k).plus(6))))
        );
        p16 = p16.times(16);

        if (k.lte(precision)) {
            k = k.plus(one);
            setImmediate(step);
        } else {
            callback(pi);
        }
    }

    step();
}
exports.pi = pi;

function computeAndCompare(precision, callback) {
    var startedAt = new Date();

    pi(precision, function(calculatedPi) {
        var calculatedPiAsStr = calculatedPi.toString();
        var endedAt = new Date();

        var computeSuccess = true;

        for (var i = 0; i < precision; i++) {
            var computedChar = calculatedPiAsStr[i];
            var downloadedChar = precomputedPi[i];

            if (computedChar !== downloadedChar) {
                console.log("Failed on #" + i);
                computeSuccess = false;
                break;
            }
        }

        callback({
            value: calculatedPiAsStr.slice(0, precision),
            precision: precision,
            time: (endedAt.valueOf() - startedAt.valueOf()),
            success: computeSuccess,
            handledBy: handledByGet()
        });
    });
}
exports.computeAndCompare = computeAndCompare;