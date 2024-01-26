const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.mapprovider.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.mapprovider.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  delete' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.mapprovider.db.delete,
          logger.logType.debug,
          `Record Deleted, Id ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.mapprovider.db.delete,
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
    let query = moduleScripts.mapprovider.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.mapprovider.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.mapprovider.db.fetchAll,
        logger.logType.debug,
        'Success'
      )
      resolve(res)
    })
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.mapprovider.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.mapprovider.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  findById' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.mapprovider.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.mapprovider.db.fetchById}`,
          logger.logType.debug,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.update = (mapProviderReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.mapprovider.update

    sql.query(
      query,
      [
        mapProviderReq.ProviderName,
        mapProviderReq.Active,
        mapProviderReq.UpdatedOn,
        mapProviderReq.UpdatedBy,
        mapProviderReq.Id,
        mapProviderReq.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            mapProviderReq.TenantId,
            username,
            moduleNames.mapprovider.db.update,
            logger.logType.error,
            `Error for Id: ${mapProviderReq.Id}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          mapProviderReq.TenantId,
          username,
          moduleNames.mapprovider.db.update,
          logger.logType.debug,
          `Successfully updated Id: ${mapProviderReq.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.create = (mapProviderReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.mapprovider.create
    let mapProviderId = uuidv4()

    sql.query(
      query,
      [
        mapProviderId,
        mapProviderReq.ProviderName,
        mapProviderReq.Active,
        mapProviderReq.TenantId,
        mapProviderReq.CreatedOn,
        mapProviderReq.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            mapProviderReq.TenantId,
            username,
            moduleNames.mapprovider.db.create,
            logger.logType.error,
            `Error for creating record: ${mapProviderReq.ProviderName}, Error Code: ${err.code} Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          mapProviderReq.TenantId,
          username,
          moduleNames.mapprovider.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${mapProviderId}`
        )
        resolve(mapProviderId)
      }
    )
  })
}
