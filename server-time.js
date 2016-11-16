var handledByGet = require('./handled-by.js').handledByGet;

function serverTimeGet() {
    return {
        value: new Date().toISOString(),
        success: true,
        handledBy: handledByGet()
    };
}
exports.serverTimeGet = serverTimeGet;