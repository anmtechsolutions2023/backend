const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')

exports.deleteUOM = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uom.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.uom.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB UOM Error, for operation:  deleteUOM.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.uom.db.delete,
          logger.logType.debug,
          `Deleted record Id: ${id}, affected Rows are: ${res.affectedRows} `
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.uom.db.delete,
          logger.logType.error,
          ` No Record found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.getAll = (tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uom.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.uom.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB UOM Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.uom.db.fetchAll,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.update = (uom, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uom.update

    sql.query(
      query,
      [
        uom.UnitName,
        uom.IsPrimary,
        uom.Active,
        uom.UpdatedOn,
        uom.UpdatedBy,
        uom.Id,
        uom.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            uom.TenantId,
            username,
            moduleNames.uom.db.update,
            logger.logType.error,
            `Error for Id: ${uom.Id}, Error code: ${err.code}, Error: ${err}`
          )
          return reject('DB UOM Error, for operation:  update.' + err)
        }

        logger.loggerHelper(
          uom.TenantId,
          username,
          moduleNames.uom.db.update,
          logger.logType.debug,
          `Successfully updated UOM Id: ${uom.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uom.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.uom.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB UOM Error, for operation:  findById.' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.uom.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.uom.db.fetchById}`,
          logger.logType.error,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (uom, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uom.create
    let uomId = uuidv4()

    sql.query(
      query,
      [
        uomId,
        uom.UnitName,
        uom.IsPrimary,
        uom.Active,
        uom.TenantId,
        uom.CreatedOn,
        uom.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            uom.TenantId,
            username,
            moduleNames.uom.db.create,
            logger.logType.error,
            `Error while creating record for ${uom.UnitName}, Error Code: ${err.code} , Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          uom.TenantId,
          username,
          moduleNames.uom.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${uomId}`
        )
        resolve(uomId)
      }
    )
  })
}
