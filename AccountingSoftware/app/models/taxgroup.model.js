const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.deletetaxGroup = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxgroup.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgroup.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB taxGroup Error, for operation:  deletetaxGroup' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgroup.db.delete,
          logger.logType.debug,
          `Record Deleted, Id ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgroup.db.delete,
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
    let query = moduleScripts.taxgroup.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgroup.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Tax Group Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.taxgroup.db.fetchAll,
        logger.logType.debug,
        'Success'
      )
      resolve(res)
    })
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxgroup.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.taxgroup.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Tax Group Error, for operation:  findById' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.taxgroup.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.taxgroup.db.fetchById}`,
          logger.logType.debug,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.update = (taxGroup, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxgroup.update

    sql.query(
      query,
      [
        taxGroup.Name,
        taxGroup.Active,
        taxGroup.UpdatedOn,
        taxGroup.UpdatedBy,
        taxGroup.Id,
        taxGroup.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            taxGroup.TenantId,
            username,
            moduleNames.taxgroup.db.update,
            logger.logType.error,
            `Error for Id: ${taxGroup.Id}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          taxGroup.TenantId,
          username,
          moduleNames.taxgroup.db.update,
          logger.logType.debug,
          `Successfully updated Id: ${taxGroup.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.create = (taxGroup, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxgroup.create
    let taxGroupId = uuidv4()

    sql.query(
      query,
      [
        taxGroupId,
        taxGroup.Name,
        taxGroup.Active,
        taxGroup.TenantId,
        taxGroup.CreatedOn,
        taxGroup.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            taxGroup.TenantId,
            username,
            moduleNames.taxgroup.db.create,
            logger.logType.error,
            `Error for taxGroup: ${taxGroup.Name}, Error Code: ${err.code} Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          taxGroup.TenantId,
          username,
          moduleNames.taxgroup.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${taxGroupId}`
        )
        resolve(taxGroupId)
      }
    )
  })
}
