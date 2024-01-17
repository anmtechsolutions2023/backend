const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypestatus.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypestatus.db.delete,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code}} Error: ${err}`
        )
        return reject(
          'DB TransactionTypeStatus Error, for operation:  delete TransactionTypeStatus.' +
            err
        )
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypestatus.db.delete,
          logger.logType.debug,
          `Record delete for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypestatus.db.delete,
          logger.logType.error,
          `No Record found for Id: ${id}, Error Code: ${err.code} Error: ${err}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.getAll = (tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypestatus.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypestatus.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error Occurred: ${err}`
        )
        return reject(
          'DB TransactionStatusStatus Error, for operation:  getAll.' + err
        )
      }
      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.transactiontypestatus.db.fetchAll,
        logger.logType.debug,
        `Record fetched`
      )
      resolve(res)
    })
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypestatus.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.transactiontypestatus.db.fetchById}`,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB TransactionTypeStatus Error, for operation:  findById.' + err
        )
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.transactiontypestatus.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypestatus.db.fetchById,
          logger.logType.error,
          `Record not found for Id: ${id}.`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.update = (tts, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypestatus.update

    sql.query(
      query,
      [tts.Name, tts.Active, tts.UpdatedOn, tts.UpdatedBy, tts.Id],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            tts.TenantId,
            username,
            moduleNames.transactiontypestatus.db.update,
            logger.logType.error,
            `Error occurred for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          tts.TenantId,
          username,
          moduleNames.transactiontypestatus.db.update,
          logger.logType.debug,
          `Successfully updated Id: ${tts.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.create = (tts, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.transactiontypestatus.create
    let ttsId = uuidv4()

    sql.query(
      query,
      [ttsId, tts.Name, tts.Active, tts.TenantId, tts.CreatedOn, tts.CreatedBy],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            tts.TenantId,
            username,
            moduleNames.transactiontypestatus.db.create,
            logger.logType.error,
            `Error occurred for tts Name: ${tts.Name}, Error code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }
        logger.loggerHelper(
          tts.TenantId,
          username,
          moduleNames.transactiontypestatus.db.create,
          logger.logType.debug,
          `Record created for tts Name: ${tts.Name}`
        )
        resolve(ttsId)
      }
    )
  })
}
