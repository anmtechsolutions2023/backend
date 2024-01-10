const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper.js')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uomfactor.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.uomfactor.db.delete,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error code: ${err.code}, Error: ${err}`
        )
        return reject('DB UOMFactor Error, for operation:  delete.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.uomfactor.db.delete,
          logger.logType.debug,
          `Record deleted fo Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.uomfactor.db.delete,
          logger.logType.error,
          `Record not found for Id: ${id}, Error: ${err}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.getAll = (tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uomfactor.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.uomfactor.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error occurred.`
        )
        return reject('DB UOMFactor Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.uomfactor.db.fetchAll,
        logger.logType.debug,
        'Success'
      )
      resolve(res)
    })
  })
}

exports.update = (uomf, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uomfactor.update

    sql.query(
      query,
      [
        uomf.PrimaryUOMId,
        uomf.SecondaryUOMId,
        uomf.Factor,
        uomf.Active,
        uomf.UpdatedOn,
        uomf.UpdatedBy,
        uomf.Id,
        uomf.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            uomf.TenantId,
            username,
            moduleNames.uomfactor.db.update,
            logger.logType.error,
            `Error occurred for Id: ${uomf.PrimaryUOMId}, Error Code: ${er.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          uomf.TenantId,
          username,
          moduleNames.uomfactor.db.update,
          logger.logType.debug,
          `Record updated for Id: ${uomf.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uomfactor.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.uomfactor.db.fetchById}`,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB UOMFactor Error, for operation:  findById.' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.uomfactor.db.fetchById}`,
          logger.logType.debug,
          `Record for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.uomfactor.db.fetchById}`,
          logger.logType.debug,
          `Record not found for Id: ${id}, Error: ${err}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (uomf, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.uomfactor.create
    let uomfId = uuidv4()

    sql.query(
      query,
      [
        uomfId,
        uomf.PrimaryUOMId,
        uomf.SecondaryUOMId,
        uomf.Factor,
        uomf.Active,
        uomf.TenantId,
        uomf.CreatedOn,
        uomf.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            uomf.TenantId,
            username,
            moduleNames.uomfactor.db.create,
            logger.logType.error,
            `Error occurred for uomf: ${uomf.Factor}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          uomf.TenantId,
          username,
          moduleNames.uomfactor.db.create,
          logger.logType.debug,
          `Record created for uomf: ${uomf.Factor}, with Id: ${uomfId}`
        )
        resolve(uomfId)
      }
    )
  })
}
