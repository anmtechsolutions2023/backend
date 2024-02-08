const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.addressdetail.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.addressdetail.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.addressdetail.db.delete,
          logger.logType.debug,
          `Deleted record Id: ${id}, affected Rows are: ${res.affectedRows} `
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.addressdetail.db.delete,
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
    let query = moduleScripts.addressdetail.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactdetail.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.contactdetail.db.fetchAll,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.update = (adReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.addressdetail.update

    sql.query(
      query,
      [
        adReq.AddressLine1,
        adReq.AddressLine2,
        adReq.City,
        adReq.State,
        adReq.Pincode,
        adReq.MapProviderLocationMapperId,
        adReq.Landmark,
        adReq.ContactAddressTypeId,
        adReq.Active,
        adReq.UpdatedOn,
        adReq.UpdatedBy,
        adReq.Id,
        adReq.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            adReq.TenantId,
            username,
            moduleNames.contactdetail.db.update,
            logger.logType.error,
            `Error for Id: ${adReq.Id}, Error code: ${err.code}, Error: ${err}`
          )
          return reject('DB Error, for operation:  update.' + err)
        }

        logger.loggerHelper(
          adReq.TenantId,
          username,
          moduleNames.contactdetail.db.update,
          logger.logType.debug,
          `Successfully updated Id: ${adReq.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.addressdetail.fetchById

    sql.query(query, [tenantId, id], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.addressdetail.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  findById.' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.addressdetail.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.addressdetail.db.fetchById}`,
          logger.logType.error,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (adReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.addressdetail.create
    let adId = uuidv4()

    sql.query(
      query,
      [
        adId,
        adReq.AddressLine1,
        adReq.AddressLine2,
        adReq.City,
        adReq.State,
        adReq.Pincode,
        adReq.MapProviderLocationMapperId,
        adReq.Landmark,
        adReq.ContactAddressTypeId,
        adReq.TenantId,
        adReq.Active,
        adReq.CreatedOn,
        adReq.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            adReq.TenantId,
            username,
            moduleNames.addressdetail.db.create,
            logger.logType.error,
            `Error while creating record for ${adReq.MapProviderLocationMapperId}-${adReq.ContactAddressTypeId}, Error Code: ${err.code} , Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          adReq.TenantId,
          username,
          moduleNames.addressdetail.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${adId}`
        )
        resolve(adId)
      }
    )
  })
}
