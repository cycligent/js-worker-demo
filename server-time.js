var handledByGetStr = require('./handled-by.js').handledByGetStr;

function serverTimeGet() {
    return {
        value: new Date().toISOString(),
        success: true,
        handledBy: handledByGetStr()
    };
}
exports.serverTimeGet = serverTimeGet;