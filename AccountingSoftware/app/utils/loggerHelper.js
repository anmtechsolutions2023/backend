const logger = require("./logger");


exports.loggerHelper = (tenantId, username, modulename, level, message) => {
    logger.log({ tenantId: tenantId, username: username, timestamp: new Date(), moduleName: modulename, level: level, message: message });
}

exports.logType = {
    "error": "error",
    "debug": "debug",
}