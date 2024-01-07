const { v4: uuidv4 } = require('uuid');
const sql = require("./db.js");
const statuses = require("./statuses.js");
const logger = require("../utils/loggerHelper.js");
const { tenantId } = require('../config/testdata-config.js');

exports.delete = (id, tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = 'DELETE FROM uomfactor WHERE Id = ? and TenantId = ?';

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_UOMFactor_delete", logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
                return reject("DB UOMFactor Error, for operation:  delete." + err);
            }

            if (JSON.stringify(res.affectedRows)) {
                logger.loggerHelper(tenantId, username, "DB_UOMFactor_delete,", logger.logType.debug, `Record deleted fo Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, "DB_UOMFactor_delete", logger.logType.error, `Record not found for Id: ${id}, Error: ${err}`);
                resolve(statuses.Statuses.NotFound);
            }
        })
    });
}

exports.getAll = (tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = `select 
        uomf.Id,
        uomf.PrimaryUOMId,
        uomp.UnitName as "PrimaryUnitName",
        uomp.Active as "PrimaryUnitNameActive",
        uomf.SecondaryUOMId,
        uoms.UnitName as "SecondayUnitName",
        uoms.Active as "SecondayUnitActive",
        uomf.Factor,
        uomf.TenantId,
        uomf.Active
        from uomfactor as uomf join UOM as uomp on uomf.PrimaryUOMId = uomp.Id 
        join UOM as uoms on uomf.SecondaryUOMId = uoms.Id WHERE UOM.TenantId = ?`;

        sql.query(query, [tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_UOMFactor_getAll", logger.logType.error, `Error occurred`);
                reject("DB UOMFactor Error, for operation:  getAll." + err);
            }

            resolve(res);
        });
    });
}

exports.update = (uomf, username) => {
    return new Promise((resolve, reject) => {
        let query = "UPDATE uomfactor SET PrimaryUOMId = ?, SecondaryUOMId = ?, Factor = ?, Active = ? , TenantId =?,  UpdatedOn = ?, UpdatedBy = ? WHERE Id = ? and TenantId = ?";

        sql.query(query, [uomf.PrimaryUOMId, uomf.SecondaryUOMId, uomf.Factor, uomf.Active, uomf.TenantId, uomf.UpdatedOn, uomf.UpdatedBy, uomf.Id, , uomf.TenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(uomf.TenantId, username, "DB_UOMFactor_update", logger.logType.error, `Error occurred for Id: ${uomf.PrimaryUOMId}, Error: ${err}`);
                return reject("DB UOMFactor Error, for operation:  update." + err);
            }
            resolve(res);
        });

    });
}

exports.findById = (id, tenantId, username, callerModule) => {

    return new Promise((resolve, reject) => {
        let query = `select 
        uomf.Id,
        uomf.PrimaryUOMId,
        uomp.UnitName as "PrimaryUnitName",
        uomp.Active as "PrimaryUnitNameActive",
        uomf.SecondaryUOMId,
        uoms.UnitName as "SecondayUnitName",
        uoms.Active as "SecondayUnitActive",
        uomf.Factor,
        uomf.TenantId,
        uomf.Active
        from uomfactor as uomf join UOM as uomp on uomf.PrimaryUOMId = uomp.Id 
        join UOM as uoms on uomf.SecondaryUOMId = uoms.Id WHERE uomf.Id = ? and UOM.TenantId = ?`;

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_UOMFactor_findById`, logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
                reject("DB UOMFactor Error, for operation:  findById." + err);
            }

            if (res.length) {
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_UOMFactor_findById`, logger.logType.debug, `Record not found for Id: ${id}, Error: ${err}`);
                resolve(statuses.Statuses.NotFound);
            }

        });

    });
}

exports.create = (uomf, username) => {
    return new Promise((resolve, reject) => {
        let query = "insert into uomfactor (Id, PrimaryUOMId, SecondaryUOMId, Factor, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?,?,?)";
        let uomfId = uuidv4();

        sql.query(query, [uomfId, uomf.PrimaryUOMId, uomf.SecondaryUOMId, uomf.Factor, uomf.Active, uomf.TenantId, uomf.CreatedOn, uomf.CreatedBy], (err, res) => {
            if (err) {
                logger.loggerHelper(uomf.TenantId, username, "DB_UOMFactor_create", logger.logType.error, `Error occurred for uomf: ${uomf.Factor}, Error: ${err}`);
                reject("DB UOMFactor Error, for operation:  create." + err);
            }

            logger.loggerHelper(uomf.TenantId, username, "DB_UOMFactor_create", logger.logType.debug, `Record created for uomf: ${uomf.Factor}, with Id: ${uomfId}`);
            resolve(uomfId);
        });

    });
}
