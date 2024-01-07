const { v4: uuidv4 } = require('uuid');
const sql = require("./db.js");
const statuses = require("./statuses.js");
const logger = require("../utils/loggerHelper.js");

exports.delete = (id, tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = 'DELETE FROM transactiontype WHERE Id = ? and TenantId = ?';

        sql.query(query, [id, tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_TransactionType_delete", logger.logType.error, `Error occured for Id: ${id}, Error: ${err}`);
                return reject("DB TransactionType Error, for operation:  delete." + err);
            }

            if (JSON.stringify(res.affectedRows)) {
                logger.loggerHelper(tenantId, username, "DB_TransactionType_delete,", logger.logType.debug, `Record deleted for Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, "DB_TransactionType_delete", logger.logType.debug, `Record not found for Id: ${id}`);
                resolve(statuses.Statuses.NotFound);
            }
        })
    });
}

exports.getAll = (tenantId, username) => {
    return new Promise((resolve, reject) => {

        let query = `select 
        tt.Id,
        tt.Name,
        tt.Active,
        tt.TenantId,
        ttc.Id as "TTCId",
        ttc.StartCounterNo as "TTCStartCounterNo",
        ttc.Prefix as "TTCPrefix",
        ttc.Format as "TTCFormat",
        ttc.Active as "TTCActive",
        ttc.TenantId as "TTCTenantId"
        from transactiontype as tt join transactiontypeconfig as ttc on tt.TransactionTypeConfigId = ttc.Id WHERE tt.TenantId = ?`;

        sql.query(query, [tenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, "DB_TransactionType_getAll", logger.logType.error, `Error occurred, Error: ${err}`);
                reject("DB TransactionType Error, for operation:  getAll." + err);
            }

            resolve(res);
        });
    });
}

exports.update = (tt, username) => {
    return new Promise((resolve, reject) => {
        let query = "UPDATE transactiontype SET Name = ?, TransactionTypeConfigId = ?, Active = ?, TenantId =?,  UpdatedOn = ?, UpdatedBy = ? WHERE Id = ? and TenantId = ?";

        sql.query(query, [tt.Name, tt.TransactionTypeConfigId, tt.Active, tt.TenantId, tt.UpdatedOn, tt.UpdatedBy, tt.Id, tt.TenantId], (err, res) => {
            if (err) {
                logger.loggerHelper(tt.TenantId, username, "DB_TransactionType_update", logger.logType.error, `Error occurred for Id: ${tt.TransactionTypeConfigId}, Error: ${err}`);
                return reject("DB TransactionType Error, for operation:  update." + err);
            }
            logger.loggerHelper(tt.TenantId, username, "DB_TransactionType_update", logger.logType.debug, `Record updated for Id: ${tt.TransactionTypeConfigId}`);
            resolve(res);
        });

    });
}

exports.findById = (id, tenantId, username, callerModule) => {

    return new Promise((resolve, reject) => {
        let query = `select 
        tt.Id,
        tt.Name,
        tt.Active,
        tt.TenantId,
        ttc.Id as "TTCId",
        ttc.StartCounterNo as "TTCStartCounterNo",
        ttc.Prefix as "TTCPrefix",
        ttc.Format as "TTCFormat",
        ttc.Active as "TTCActive",
        ttc.TenantId as "TTCTenantId"
        from transactiontype as tt join transactiontypeconfig as ttc on tt.TransactionTypeConfigId = ttc.Id where tt.Id = ? and tt.TenantId = ?`;

        sql.query(query, [id], (err, res) => {
            if (err) {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_TransactionType_findById`, logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
                reject("DB TransactionType Error, for operation:  findById." + err);
            }

            if (res.length) {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_TransactionType_findById`, logger.logType.debug, `Record found for Id: ${id}`);
                resolve(res);
            } else {
                logger.loggerHelper(tenantId, username, `${callerModule}-DB_TransactionType_findById`, logger.logType.debug, `Record not found for Id: ${id}`);
                resolve(statuses.Statuses.NotFound);
            }

        });

    });
}

exports.create = (tt, username) => {
    return new Promise((resolve, reject) => {
        let query = "insert into transactiontype (Id, Name, TransactionTypeConfigId, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?,?)";
        let ttId = uuidv4();

        sql.query(query, [ttId, tt.Name, tt.TransactionTypeConfigId, tt.Active, tt.TenantId, tt.CreatedOn, tt.CreatedBy], (err, res) => {
            if (err) {
                logger.loggerHelper(tt.TenantId, username, "DB_TransactionType_create", logger.logType.error, `Error occurred for tt name: ${tt.Name}, Error : ${err}`);
                reject("DB TransactionType Error, for operation:  create." + err);
            }
            logger.loggerHelper(tt.TenantId, username, "DB_TransactionType_create", logger.logType.debug, `Record created for tt name: ${tt.Name}, with Id: ${ttId}`);
            resolve(ttId);
        });

    });
}
