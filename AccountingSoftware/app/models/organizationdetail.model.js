const { v4: uuidv4 } = require('uuid');
const sql = require("./db.js");
const statuses = require("./statuses.js");
const logger = require("../utils/loggerHelper.js");
const { tenantId } = require('../config/testdata-config.js');

exports.delete = (id, tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = 'DELETE FROM organizationdetail WHERE Id = ? and TenantId = ?';

        sql.query(query, [id], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_OrganizationDetail_delete", logger.logType.error, `Error occurred for Id: ${id}, Error: ${err} `);
                return reject("DB OrganizationDetail Error, for operation:  delete." + err);
            }

            if (JSON.stringify(res.affectedRows)) {
                logger.loggerHelper(tenantId, username, "DB_OrganizationDetail_delete", logger.logType.debug, `Record deleted for Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, "DB_OrganizationDetail_delete", logger.logType.error, `No record found for Id: ${id}`);
                resolve(statuses.Statuses.NotFound);
            }
        })
    });
}

exports.getAll = (tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = "SELECT * FROM organizationdetail WHERE TenantId = ?";

        sql.query(query, [tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_OrganizationDetail_getAll", logger.logType.error, `Error occurred, Error: ${err}`);
                reject("DB OrganizationDetail Error, for operation:  getAll." + err);
            }

            logger.loggerHelper(tenantId, username, "DB_OrganizationDetail_getAll", logger.logType.debug, `Success`);
            resolve(res);
        });
    });
}

exports.update = (od, username) => {
    return new Promise((resolve, reject) => {
        let query = "UPDATE organizationdetail SET Name = ?, Active = ?, TenantId =?,  UpdatedOn = ?, UpdatedBy = ? WHERE Id = ? and TenantId = ?";

        sql.query(query, [od.Name, od.Active, od.TenantId, od.UpdatedOn, od.UpdatedBy, od.Id, od.TenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(od.TenantId, username, "DB_OrganizationDetail_update", logger.logType.error, `Error Occurred for Id: ${od.Id}, Error: ${err} `);
                return reject("DB OrganizationDetail Error, for operation:  update." + err);
            }
            resolve(res);
        });

    });
}

exports.findById = (id, tenantId, username, callerModule) => {

    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM organizationdetail WHERE Id = ? and TenantId = ?';

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, `${callerModule} -DB_OrganizationDetail_findById`, logger.logType.error, `Error occurred for Id: ${id}, Error: ${err} `);
                reject("DB OrganizationDetail Error, for operation:  findById." + err);
            }

            if (res.length) {
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, `${callerModule} -DB_OrganizationDetail_findById`, logger.logType.debug, `Record not found for Id: ${id} `);
                resolve(statuses.Statuses.NotFound);
            }

        });

    });
}

exports.create = (od, username) => {
    return new Promise((resolve, reject) => {
        let query = "insert into organizationdetail (Id, Name, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?)";
        let odId = uuidv4();

        sql.query(query, [odId, od.Name, od.Active, od.TenantId, od.CreatedOn, od.CreatedBy], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_OrganizationDetail_create", logger.logType.error, `Error occurred for org name: ${od.Name}, Error: ${err}`);
                reject("DB OrganizationDetail Error, for operation:  create." + err);
            }

            resolve(odId);
        });

    });
}
