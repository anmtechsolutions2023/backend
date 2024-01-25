const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxgrouptaxtypemapper.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgrouptaxtypemapper.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgrouptaxtypemapper.db.delete,
          logger.logType.debug,
          `Deleted record Id: ${id}, affected Rows are: ${res.affectedRows} `
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.uom.taxgrouptaxtypemapper.delete,
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
    let query = moduleScripts.taxgrouptaxtypemapper.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgrouptaxtypemapper.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.taxgrouptaxtypemapper.db.fetchAll,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.searchByName = (tenantId, username, TaxGroupName) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxgrouptaxtypemapper.searchbyname

    sql.query(query, [tenantId, TaxGroupName], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgrouptaxtypemapper.db.searchbyname,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  searchbyname.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.taxgrouptaxtypemapper.db.searchbyname,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.update = (tgttmReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxgrouptaxtypemapper.update

    sql.query(
      query,
      [
        tgttmReq.TaxGroupId,
        tgttmReq.TaxTypeId,
        tgttmReq.Active,
        tgttmReq.UpdatedOn,
        tgttmReq.UpdatedBy,
        tgttmReq.Id,
        tgttmReq.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            tgttmReq.TenantId,
            username,
            moduleNames.taxgrouptaxtypemapper.db.update,
            logger.logType.error,
            `Error for Id: ${tgttmReq.Id}, Error code: ${err.code}, Error: ${err}`
          )
          return reject('DB Error, for operation:  update.' + err)
        }

        logger.loggerHelper(
          tgttmReq.TenantId,
          username,
          moduleNames.taxgrouptaxtypemapper.db.update,
          logger.logType.debug,
          `Successfully updated UOM Id: ${tgttmReq.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxgrouptaxtypemapper.fetchById

    sql.query(query, [tenantId, id], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.taxgrouptaxtypemapper.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  findById.' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.taxgrouptaxtypemapper.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.taxgrouptaxtypemapper.db.fetchById}`,
          logger.logType.error,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (tgttmReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.taxgrouptaxtypemapper.create
    let tgttmId = uuidv4()

    sql.query(
      query,
      [
        tgttmId,
        tgttmReq.TaxGroupId,
        tgttmReq.TaxTypeId,
        tgttmReq.TenantId,
        tgttmReq.Active,
        tgttmReq.CreatedOn,
        tgttmReq.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            tgttmReq.TenantId,
            username,
            moduleNames.taxgrouptaxtypemapper.db.create,
            logger.logType.error,
            `Error while creating record for ${tgttmReq.TaxGroupId}-${tgttmReq.TaxTypeId}, Error Code: ${err.code} , Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          tgttmId.TenantId,
          username,
          moduleNames.taxgrouptaxtypemapper.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${tgttmId}`
        )
        resolve(tgttmId)
      }
    )
  })
}
