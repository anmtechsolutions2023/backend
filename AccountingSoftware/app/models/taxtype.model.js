const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.deleteTaxType = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxtypes.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxtypes.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB TaxType Error, for operation:  deleteTaxType' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxtypes.db.delete,
          logger.logType.debug,
          `Record Deleted, Id ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxtypes.db.delete,
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
    let query = moduleScripts.taxtypes.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxtypes.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB TaxType Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.taxtypes.db.fetchAll,
        logger.logType.debug,
        'Success'
      )
      resolve(res)
    })
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxtypes.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.taxtypes.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB TaxType Error, for operation:  findById' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.taxtypes.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}-${moduleNames.taxtypes.db.fetchById}`,
          logger.logType.debug,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.update = (taxType, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxtypes.update

    sql.query(
      query,
      [
        taxType.Name,
        taxType.Value,
        taxType.Active,
        taxType.UpdatedOn,
        taxType.UpdatedBy,
        taxType.Id,
        taxType.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            taxType.TenantId,
            username,
            moduleNames.taxtypes.db.update,
            logger.logType.error,
            `Error for Id: ${taxType.Id}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          taxType.TenantId,
          username,
          moduleNames.taxtypes.db.update,
          logger.logType.debug,
          `Successfully updated Id: ${taxType.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.create = (taxtype, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxtypes.create
    let taxTypeId = uuidv4()

    sql.query(
      query,
      [
        taxTypeId,
        taxtype.Name,
        taxtype.Value,
        taxtype.Active,
        taxtype.TenantId,
        taxtype.CreatedOn,
        taxtype.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            taxtype.TenantId,
            username,
            moduleNames.taxtypes.db.create,
            logger.logType.error,
            `Error for taxType: ${taxtype.Name}, Error Code: ${err.code} Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          taxtype.TenantId,
          username,
          moduleNames.taxtypes.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${taxTypeId}`
        )
        resolve(taxTypeId)
      }
    )
  })
}
