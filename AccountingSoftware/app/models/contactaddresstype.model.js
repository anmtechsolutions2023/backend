const { v4: uuidv4 } = require('uuid');
const sql = require("./db.js");
const statuses = require("./statuses.js")
const logger = require("../utils/loggerHelper");

exports.delete = (id, tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = 'DELETE FROM contactaddresstype WHERE Id = ? and TenantId = ?';

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_contactaddresstype_delete", logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
                return reject("DB contactaddresstype Error, for operation:  delete contactaddresstype." + err);
            }

            if (JSON.stringify(res.affectedRows)) {
                logger.loggerHelper(tenantId, username, "DB_contactaddresstype_delete", logger.logType.debug, `Record deleted for Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, "DB_contactaddresstype_delete", logger.logType.error, `Record not found for Id: ${id}`);
                resolve(statuses.Statuses.NotFound);
            }
        })
    });
}

exports.getAll = (tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = "SELECT * FROM contactaddresstype WHERE TenantId = ?";

        sql.query(query, [tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_ContactAddressType_getAll", logger.logType.error, `Error occurred, ${err}`);
                return reject("DB ContactAddressType Error, for operation:  getAll." + err);
            }
            resolve(res);
        });
    });
}

exports.findById = (id, tenantId, username, callerModule) => {

    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM contactaddresstype WHERE Id = ? and TenantId = ?';

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_ContactAddressType_findById`, logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
                return reject("DB ContactAddressType Error, for operation:  findById." + err);
            }

            if (res.length) {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_ContactAddressType_findById`, logger.logType.debug, `Record found for Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_ContactAddressType_findById`, logger.logType.error, `No Record found for Id: ${id}`);
                resolve(statuses.Statuses.NotFound);
            }

        });

    });
}

exports.update = (cat, username) => {
    return new Promise((resolve, reject) => {
        let query = "UPDATE contactaddresstype SET Name = ?, Active = ?, TenantId =?,  UpdatedOn = ?, UpdatedBy = ? WHERE Id = ? and TenantId = ?";

        sql.query(query, [cat.Name, cat.Active, cat.TenantId, cat.UpdatedOn, cat.UpdatedBy, cat.Id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(cat.TenantId, username, "DB_ContactAddressType_update", logger.logType.error, `Error occurred for Id: ${cat.TenantId}, Error: ${err}`);
                return reject("DB DB_ContactAddressType Error, for operation:  update." + err);
            }
            logger.loggerHelper(cat.TenantId, username, "DB_ContactAddressType_update", logger.logType.debug, `Record updated for Id: ${cat.TenantId}`);
            resolve(res);
        });

    });
}

exports.create = (cat, username) => {
    return new Promise((resolve, reject) => {

        let query = "insert into contactaddresstype (Id, Name, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?)";
        let catId = uuidv4();

        sql.query(query, [catId, cat.Name, cat.Active, cat.TenantId, cat.CreatedOn, cat.CreatedBy], (err, res) => {
            if (err) {
                logger.loggerHelper(cat.TenantId, username, "DB_ContactAddressType_create", logger.logType.error, `Error occurred for cat Name: ${cat.Name}, Error: ${err}`);
                return reject("DB ContactAddressType Error, for operation:  create." + err);
            }
            logger.loggerHelper(cat.TenantId, username, "DB_ContactAddressType_create", logger.logType.debug, `Record created for cat Name: ${cat.Name} with Id: ${catId}`);
            resolve(catId);
        });

    });
}