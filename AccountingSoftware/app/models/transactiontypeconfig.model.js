const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper.js')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypeconfig.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypeconfig.db.delete,
          logger.logType.error,
          `Error occurred while deleting record for Id: ${id}, Error code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB TransactionTypeDetail Error, for operation:  delete.' + err
        )
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypeconfig.db.delete,
          logger.logType.debug,
          `Record deleted for Id:${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypeconfig.db.delete,
          logger.logType.debug,
          `No Record found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.getAll = (tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypeconfig.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypeconfig.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB TransactionTypeConfig Error, for operation:  getAll.' + err
        )
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.transactiontypeconfig.db.fetchAll,
        logger.logType.debug,
        'Success'
      )
      resolve(res)
    })
  })
}

exports.update = (ttc, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypeconfig.update

    sql.query(
      query,
      [
        ttc.StartCounterNo,
        ttc.Prefix,
        ttc.Format,
        ttc.Active,
        ttc.UpdatedOn,
        ttc.UpdatedBy,
        ttc.Id,
        ttc.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            ttc.TenantId,
            username,
            moduleNames.transactiontypeconfig.db.update,
            logger.logType.error,
            `Error occurred for Id: ${ttc.Id}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          ttc.TenantId,
          username,
          moduleNames.transactiontypeconfig.db.update,
          logger.logType.debug,
          `Record updated for Id: ${ttc.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypeconfig.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.transactiontypeconfig.db.fetchById}`,
          logger.logType.error,
          `Error occurred for Id:${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB TransactionTypeConfig Error, for operation:  findById.' + err
        )
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.transactiontypeconfig.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.transactiontypeconfig.db.fetchById}`,
          logger.logType.debug,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (ttc, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypeconfig.create
    let ttcId = uuidv4()

    sql.query(
      query,
      [
        ttcId,
        ttc.StartCounterNo,
        ttc.Prefix,
        ttc.Format,
        ttc.Active,
        ttc.TenantId,
        ttc.CreatedOn,
        ttc.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            ttc.TenantId,
            username,
            moduleNames.transactiontypeconfig.db.create,
            logger.logType.error,
            `Error occurred for transaction type config counter: ${ttc.StartCounterNo}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          ttc.TenantId,
          username,
          moduleNames.transactiontypeconfig.db.create,
          logger.logType.debug,
          `Record created for Id: ${ttcId}`
        )
        resolve(ttcId)
      }
    )
  })
}
