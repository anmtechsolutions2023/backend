const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint, json } = format;

const logger = createLogger({

    format: combine(
        json(),
        timestamp({
            format: "DD-MMM-YYYY HH:mm:ss",
        }),
        format.printf(options => {
            return `{"TenantId" : "${options.tenantId}", "Username" : "${options.username}", "timestamp": "${options.timestamp}", "modulename" : "${options.moduleName}", "level" : "${options.level}", "message": "${options.message}"}`;
        })),

    transports: [

        new transports.File({
            level: "eror",
            filename: "logs/error.log",
        }),
        new transports.File({
            level: "debug",
            filename: "logs/debug.log",
        })
    ]
});

module.exports = logger;