const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactaddresstype.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactaddresstype.db.delete,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB contactaddresstype Error, for operation:  delete contactaddresstype.' +
            err
        )
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactaddresstype.db.delete,
          logger.logType.debug,
          `Record deleted for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactaddresstype.db.delete,
          logger.logType.error,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.getAll = (tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactaddresstype.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactaddresstype.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error occurred, ${err}`
        )
        return reject(
          'DB ContactAddressType Error, for operation:  getAll.' + err
        )
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.contactaddresstype.db.fetchAll,
        logger.logType.debug,
        'Success'
      )
      resolve(res)
    })
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactaddresstype.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.contactaddresstype.db.fetchById}`,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB ContactAddressType Error, for operation:  findById.' + err
        )
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.contactaddresstype.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.contactaddresstype.db.fetchById}`,
          logger.logType.error,
          `No Record found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.update = (cat, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactaddresstype.update

    sql.query(
      query,
      [
        cat.Name,
        cat.Active,
        cat.UpdatedOn,
        cat.UpdatedBy,
        cat.Id,
        cat.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            cat.TenantId,
            username,
            moduleNames.contactaddresstype.db.update,
            logger.logType.error,
            `Error occurred for Id: ${cat.TenantId}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }
        logger.loggerHelper(
          cat.TenantId,
          username,
          moduleNames.contactaddresstype.db.update,
          logger.logType.debug,
          `Record updated for Id: ${cat.TenantId}`
        )
        resolve(res)
      }
    )
  })
}

exports.create = (cat, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactaddresstype.create
    let catId = uuidv4()

    sql.query(
      query,
      [catId, cat.Name, cat.Active, cat.TenantId, cat.CreatedOn, cat.CreatedBy],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            cat.TenantId,
            username,
            moduleNames.contactaddresstype.db.create,
            logger.logType.error,
            `Error occurred for cat Name: ${cat.Name}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }
        logger.loggerHelper(
          cat.TenantId,
          username,
          moduleNames.contactaddresstype.db.create,
          logger.logType.debug,
          `Record created for cat Name: ${cat.Name} with Id: ${catId}`
        )
        resolve(catId)
      }
    )
  })
}
