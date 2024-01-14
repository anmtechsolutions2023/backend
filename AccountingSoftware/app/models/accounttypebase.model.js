const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.accounttypebase.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.accounttypebase.db.delete,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB AccountTypeBase Error, for operation:  delete AccountTypeBase.' +
            err
        )
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.accounttypebase.db.delete,
          logger.logType.debug,
          `Record deleted for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.accounttypebase.db.delete,
          logger.logType.error,
          `No Record found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.getAll = (tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.accounttypebase.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.accounttypebase.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error Occurred, Error: ${err}`
        )
        return reject('DB AccountTypeBase Error, for operation:  getAll.' + err)
      }
      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.accounttypebase.db.fetchAll,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.accounttypebase.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.accounttypebase.db.fetchById}`,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB AccountTypeBase Error, for operation:  findById.' + err
        )
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.accounttypebase.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.accounttypebase.db.fetchById}`,
          logger.logType.debug,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.update = (atb, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.accounttypebase.update

    sql.query(
      query,
      [
        atb.Name,
        atb.Active,
        atb.UpdatedOn,
        atb.UpdatedBy,
        atb.Id,
        atb.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            atb.TenantId,
            username,
            moduleNames.accounttypebase.db.update,
            logger.logType.error,
            `Error occured for Id: ${atb.Id}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }
        logger.loggerHelper(
          atb.TenantId,
          username,
          moduleNames.accounttypebase.db.update,
          logger.logType.debug,
          `Record updated for Id: ${atb.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.create = (atb, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.accounttypebase.create
    let atbId = uuidv4()

    sql.query(
      query,
      [atbId, atb.Name, atb.Active, atb.TenantId, atb.CreatedOn, atb.CreatedBy],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            atb.TenantId,
            username,
            moduleNames.accounttypebase.db.create,
            logger.logType.error,
            `Error occurred for atb Name: ${atb.Name}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }
        logger.loggerHelper(
          atb.TenantId,
          username,
          moduleNames.accounttypebase.db.create,
          logger.logType.debug,
          `Record Created for atb Name: ${atb.Name}`
        )
        resolve(atbId)
      }
    )
  })
}
