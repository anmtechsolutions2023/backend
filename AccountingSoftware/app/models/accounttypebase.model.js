const { v4: uuidv4 } = require('uuid');
const sql = require("./db.js");
const statuses = require("./statuses.js")
const logger = require("../utils/loggerHelper");

exports.delete = (id, tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = 'DELETE FROM accounttypebase WHERE Id = ? and TenantId = ?';

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_AccountTypeBase_delete", logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
                return reject("DB AccountTypeBase Error, for operation:  delete AccountTypeBase." + err);
            }

            if (JSON.stringify(res.affectedRows)) {
                logger.loggerHelper(tenantId, username, "DB_AccountTypeBase_delete", logger.logType.debug, `Record deleted for Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, "DB_AccountTypeBase_delete", logger.logType.error, `No Record found for Id: ${id}`);
                resolve(statuses.Statuses.NotFound);
            }
        })
    });
}

exports.getAll = (tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = "SELECT * FROM accounttypebase WHERE TenantId = ?";

        sql.query(query, [tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_AccountTypeBase_getAll", logger.logType.error, `Error Occurred, Error: ${err}`);
                return reject("DB AccountTypeBase Error, for operation:  getAll." + err);
            }
            logger.loggerHelper(tenantId, username, "DB_AccountTypeBase_getAll", logger.logType.debug, `Success`);
            resolve(res);
        });
    });
}

exports.findById = (id, tenantId, username, callerModule) => {

    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM accounttypebase WHERE Id = ? and TenantId = ?';

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_AccountTypeBase_findById`, logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
                return reject("DB AccountTypeBase Error, for operation:  findById." + err);
            }

            if (res.length) {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_AccountTypeBase_findById`, logger.logType.debug, `Record found for Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_AccountTypeBase_findById`, logger.logType.debug, `Record not found for Id: ${id}`);
                resolve(statuses.Statuses.NotFound);
            }

        });

    });
}

exports.update = (atb, username) => {
    return new Promise((resolve, reject) => {
        let query = "UPDATE accounttypebase SET Name = ?, Active = ?, TenantId =?,  UpdatedOn = ?, UpdatedBy = ? WHERE Id = ? and TenantId = ?";

        sql.query(query, [atb.Name, atb.Active, atb.TenantId, atb.UpdatedOn, atb.UpdatedBy, atb.Id, atb.TenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(atb.TenantId, username, "DB_AccountTypeBase_update", logger.logType.error, `Error occured for Id: ${atb.Id}, Error: ${err}`);
                return reject("DB AccountTypeBase Error, for operation:  update." + err);
            }
            logger.loggerHelper(atb.TenantId, username, "DB_AccountTypeBase_update", logger.logType.debug, `Record updated for Id: ${atb.Id}`);
            resolve(res);
        });

    });
}

exports.create = (atb, username) => {

    return new Promise((resolve, reject) => {

        let query = "insert into accounttypebase (Id, Name, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?)";
        let atbId = uuidv4();

        sql.query(query, [atbId, atb.Name, atb.Active, atb.TenantId, atb.CreatedOn, atb.CreatedBy], (err, res) => {
            if (err) {
                logger.loggerHelper(atb.TenantId, username, "DB_AccountTypeBase_create", logger.logType.error, `Error occurred for atb Name: ${atb.Name}, Error: ${err}`);
                return reject("DB AccountTypeBase Error, for operation:  create." + err);
            }
            logger.loggerHelper(atb.TenantId, username, "DB_AccountTypeBase_create", logger.logType.debug, `Record Created for atb Name: ${atb.Name}`);
            resolve(atbId);
        });

    });
}