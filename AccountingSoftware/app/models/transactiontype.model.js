const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper.js')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypes.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypes.db.delete,
          logger.logType.error,
          `Error occured for Id: ${id}, Error Code: ${err.code} Error: ${err}`
        )
        return reject('DB TransactionType Error, for operation:  delete.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypes.db.delete,
          logger.logType.debug,
          `Record deleted for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypes.db.delete,
          logger.logType.debug,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.getAll = (tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypes.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypes.db.fetchAll,
          logger.logType.error,
          `Error occurred, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB TransactionType Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.transactiontypes.db.fetchAll,
        logger.logType.debug,
        'Success'
      )
      resolve(res)
    })
  })
}

exports.update = (tt, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypes.update

    sql.query(
      query,
      [
        tt.Name,
        tt.TransactionTypeConfigId,
        tt.Active,
        tt.UpdatedOn,
        tt.UpdatedBy,
        tt.Id,
        tt.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            tt.TenantId,
            username,
            moduleNames.transactiontypes.db.update,
            logger.logType.error,
            `Error occurred for Id: ${tt.TransactionTypeConfigId}, Error Code: ${err.code} Error: ${err}`
          )
          return reject(err.code)
        }
        logger.loggerHelper(
          tt.TenantId,
          username,
          moduleNames.transactiontypes.db.update,
          logger.logType.debug,
          `Record updated for Id: ${tt.TransactionTypeConfigId}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypes.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.transactiontypes.db.fetchById}`,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB TransactionType Error, for operation:  findById.' + err
        )
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.transactiontypes.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.transactiontypes.db.fetchById}`,
          logger.logType.debug,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (tt, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypes.create
    let ttId = uuidv4()

    sql.query(
      query,
      [
        ttId,
        tt.Name,
        tt.TransactionTypeConfigId,
        tt.Active,
        tt.TenantId,
        tt.CreatedOn,
        tt.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            tt.TenantId,
            username,
            moduleNames.transactiontypes.db.create,
            logger.logType.error,
            `Error occurred for tt name: ${tt.Name}, Error Code: ${err.code} Error : ${err}`
          )
          return reject(err.code)
        }
        logger.loggerHelper(
          tt.TenantId,
          username,
          moduleNames.transactiontypes.db.create,
          logger.logType.debug,
          `Record created for tt name: ${tt.Name}, with Id: ${ttId}`
        )
        resolve(ttId)
      }
    )
  })
}
