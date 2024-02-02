const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.mapproviderlocationmapper.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.mapproviderlocationmapper.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.mapproviderlocationmapper.db.delete,
          logger.logType.debug,
          `Deleted record Id: ${id}, affected Rows are: ${res.affectedRows} `
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgrouptaxtypemapper.db.delete,
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
    let query = moduleScripts.mapproviderlocationmapper.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.mapproviderlocationmapper.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.mapproviderlocationmapper.db.fetchAll,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.update = (mplmReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.mapproviderlocationmapper.update

    sql.query(
      query,
      [
        mplmReq.MapProviderId,
        mplmReq.LocationDetailId,
        mplmReq.Active,
        mplmReq.UpdatedOn,
        mplmReq.UpdatedBy,
        mplmReq.Id,
        mplmReq.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            mplmReq.TenantId,
            username,
            moduleNames.mapproviderlocationmapper.db.update,
            logger.logType.error,
            `Error for Id: ${mplmReq.Id}, Error code: ${err.code}, Error: ${err}`
          )
          return reject('DB Error, for operation:  update.' + err)
        }

        logger.loggerHelper(
          mplmReq.TenantId,
          username,
          moduleNames.mapproviderlocationmapper.db.update,
          logger.logType.debug,
          `Successfully updated UOM Id: ${mplmReq.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.mapproviderlocationmapper.fetchById

    sql.query(query, [tenantId, id], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.mapproviderlocationmapper.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  findById.' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.mapproviderlocationmapper.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.mapproviderlocationmapper.db.fetchById}`,
          logger.logType.error,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (mplmReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.mapproviderlocationmapper.create
    let mplmId = uuidv4()

    sql.query(
      query,
      [
        mplmId,
        mplmReq.MapProviderId,
        mplmReq.LocationDetailId,
        mplmReq.TenantId,
        mplmReq.Active,
        mplmReq.CreatedOn,
        mplmReq.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            mplmReq.TenantId,
            username,
            moduleNames.mapproviderlocationmapper.db.create,
            logger.logType.error,
            `Error while creating record for ${mplmReq.MapProviderId}-${mplmReq.LocationDetailId}, Error Code: ${err.code} , Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          mplmReq.TenantId,
          username,
          moduleNames.mapproviderlocationmapper.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${mplmId}`
        )
        resolve(mplmId)
      }
    )
  })
}
