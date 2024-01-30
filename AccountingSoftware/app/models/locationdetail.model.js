const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.locationdetail.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.locationdetail.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  delete' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.locationdetail.db.delete,
          logger.logType.debug,
          `Record Deleted, Id ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.locationdetail.db.delete,
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
    let query = moduleScripts.locationdetail.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.locationdetail.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.locationdetail.db.fetchAll,
        logger.logType.debug,
        'Success'
      )
      resolve(res)
    })
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.locationdetail.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.locationdetail.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  findById' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.locationdetail.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.locationdetail.db.fetchById}`,
          logger.logType.debug,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.update = (locationDetailReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.locationdetail.update

    sql.query(
      query,
      [
        locationDetailReq.Lat,
        locationDetailReq.Lng,
        locationDetailReq.CF1,
        locationDetailReq.CF2,
        locationDetailReq.CF3,
        locationDetailReq.CF4,
        locationDetailReq.Active,
        locationDetailReq.UpdatedOn,
        locationDetailReq.UpdatedBy,
        locationDetailReq.Id,
        locationDetailReq.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            locationDetailReq.TenantId,
            username,
            moduleNames.locationdetail.db.update,
            logger.logType.error,
            `Error for Id: ${locationDetailReq.Id}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          locationDetailReq.TenantId,
          username,
          moduleNames.locationdetail.db.update,
          logger.logType.debug,
          `Successfully updated Id: ${locationDetailReq.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.create = (locationDetailReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.locationdetail.create
    let locationDetailId = uuidv4()

    sql.query(
      query,
      [
        locationDetailId,
        locationDetailReq.Lat,
        locationDetailReq.Lng,
        locationDetailReq.CF1,
        locationDetailReq.CF2,
        locationDetailReq.CF3,
        locationDetailReq.CF4,
        locationDetailReq.Active,
        locationDetailReq.TenantId,
        locationDetailReq.CreatedOn,
        locationDetailReq.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            locationDetailReq.TenantId,
            username,
            moduleNames.locationdetail.db.create,
            logger.logType.error,
            `Error for creating record: ${locationDetailReq.Lat}-${locationDetailReq.Lng}, Error Code: ${err.code} Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          locationDetailReq.TenantId,
          username,
          moduleNames.locationdetail.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${locationDetailId}`
        )
        resolve(locationDetailId)
      }
    )
  })
}
