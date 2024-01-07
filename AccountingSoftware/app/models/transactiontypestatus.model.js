const { v4: uuidv4 } = require('uuid');
const sql = require("./db.js");
const statuses = require("./statuses.js")
const logger = require("../utils/loggerHelper");
const { tenantId } = require('../config/testdata-config.js');

exports.delete = (id, tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = 'DELETE FROM transactiontypestatus WHERE Id = ? and TenantId = ?';

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_TransactionTypeStatus_delete", logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
                return reject("DB TransactionTypeStatus Error, for operation:  delete TransactionTypeStatus." + err);
            }

            if (JSON.stringify(res.affectedRows)) {
                logger.loggerHelper(tenantId, username, "DB_TransactionTypeStatus_delete", logger.logType.debug, `Record delete for Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, "DB_TransactionTypeStatus_delete", logger.logType.error, `No Record found for Id: ${id}, Error: ${err}`);
                resolve(statuses.Statuses.NotFound);
            }
        })
    });
}

exports.getAll = (tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = "SELECT * FROM transactiontypestatus WHERE TenantId = ?";

        sql.query(query, [tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_TransactionStatusStatus_getAll", logger.logType.error, `Error Occurred: ${err}`);
                return reject("DB TransactionStatusStatus Error, for operation:  getAll." + err);
            }
            logger.loggerHelper(tenantId, username, "DB_TransactionStatusStatus_getAll", logger.logType.debug, `Record fetched`);
            resolve(res);
        });
    });
}

exports.findById = (id, tenantId, username, callerModule) => {

    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM transactiontypestatus WHERE Id = ? and TenantId = ?';

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_TransactionTypeStatus_findById", logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
                return reject("DB TransactionTypeStatus Error, for operation:  findById." + err);
            }

            if (res.length) {
                logger.loggerHelper(tenantId, username, "DB_TransactionTypeStatus_findById", logger.logType.debug, `Record found for Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, "DB_TransactionTypeStatus_findById", logger.logType.error, `Record not found for Id: ${id}, Error: ${err}`);
                resolve(statuses.Statuses.NotFound);
            }

        });

    });
}

exports.update = (tts, username) => {
    return new Promise((resolve, reject) => {
        let query = "UPDATE transactiontypestatus SET Name = ?, Active = ? , TenantId =?,  UpdatedOn = ?, UpdatedBy = ? WHERE Id = ?";

        sql.query(query, [tts.Name, tts.Active, tts.TenantId, tts.UpdatedOn, tts.UpdatedBy, tts.Id], (err, res) => {
            if (err) {
                logger.loggerHelper("DB_ATransactionTypeStatus_update", "error", err);
                return reject("DB TransactionTypeStatus Error, for operation:  update." + err);
            }
            resolve(res);
        });

    });
}

exports.create = (tts, username) => {

    return new Promise((resolve, reject) => {

        let query = "insert into transactiontypestatus (Id, Name, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?)";
        let ttsId = uuidv4();

        sql.query(query, [ttsId, tts.Name, tts.Active, tts.TenantId, tts.CreatedOn, tts.CreatedBy], (err, res) => {
            if (err) {
                logger.loggerHelper(tts.TenantId, username, "DB_TransactionTypeStatus_create", logger.logType.error, `Error occurred for tts Name: ${tts.Name}, Error: ${err}`);
                return reject("DB TransactionTypeStatus Error, for operation:  create." + err);
            }
            logger.loggerHelper(tts.TenantId, username, "DB_TransactionTypeStatus_create", logger.logType.debug, `Record created for tts Name: ${tts.Name}`);
            resolve(ttsId);
        });

    });
}