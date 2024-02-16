const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.batchdetail.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.batchdetail.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.batchdetail.db.delete,
          logger.logType.debug,
          `Deleted record Id: ${id}, affected Rows are: ${res.affectedRows} `
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.batchdetail.db.delete,
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
    let query = moduleScripts.batchdetail.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.batchdetail.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.batchdetail.db.fetchAll,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.searchByParam = (tenantId, username, queryParams) => {
  let query = null

  return new Promise((resolve, reject) => {
    switch (queryParams.QueryParamName) {
      case 'BatchNo':
        query = moduleScripts.batchdetail.fetchAll + ' AND BatchNo = ?'
        break
      case 'Barcode':
        query = moduleScripts.batchdetail.fetchAll + ' AND Barcode = ?'
        break
      case 'MfgDate':
        query = moduleScripts.batchdetail.fetchAll + ' AND MfgDate = ?'
        break
      case 'Expdate':
        query = moduleScripts.batchdetail.fetchAll + ' AND Expdate = ?'
        break
      case 'PurchaseDate':
        query = moduleScripts.batchdetail.fetchAll + ' AND PurchaseDate = ?'
        break
      case 'IsNonReturnable':
        query = moduleScripts.batchdetail.fetchAll + ' AND IsNonReturnable = ?'
        break
      case 'CostInfoId':
        query = moduleScripts.batchdetail.fetchAll + ' AND CostInfoId = ?'
        break
      case 'UOMId':
        query = moduleScripts.batchdetail.fetchAll + ' AND UOMId = ?'
        break
      case 'Quantity':
        query = moduleScripts.batchdetail.fetchAll + ' AND Quantity = ?'
        break
      case 'MapProviderLocationMapperId':
        query =
          moduleScripts.batchdetail.fetchAll +
          ' AND MapProviderLocationMapperId = ?'
        break
      case 'BranchDetailId':
        query = moduleScripts.batchdetail.fetchAll + ' AND BranchDetailId = ?'
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.batchdetail.db.searchbyname,
          logger.logType.error,
          `Not supported query param.`
        )
        return reject(statuses.Statuses.BadRequest)
      }
    }

    sql.query(query, [tenantId, queryParams.QueryParamValue], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.batchdetail.db.searchbyname,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  searchbyname.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.batchdetail.db.searchbyname,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.update = (updatedReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.batchdetail.update

    sql.query(
      query,
      [
        updatedReq.BatchNo,
        updatedReq.Barcode,
        updatedReq.MfgDate,
        updatedReq.Expdate,
        updatedReq.PurchaseDate,
        updatedReq.IsNonReturnable,
        updatedReq.CostInfoId,
        updatedReq.UOMId,
        updatedReq.Quantity,
        updatedReq.MapProviderLocationMapperId,
        updatedReq.BranchDetailId,
        updatedReq.Active,
        updatedReq.UpdatedOn,
        updatedReq.UpdatedBy,
        updatedReq.Id,
        updatedReq.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            updatedReq.TenantId,
            username,
            moduleNames.batchdetail.db.update,
            logger.logType.error,
            `Error for Id: ${updatedReq.Id}, Error code: ${err.code}, Error: ${err}`
          )
          return reject('DB Error, for operation:  update.' + err)
        }

        logger.loggerHelper(
          updatedReq.TenantId,
          username,
          moduleNames.batchdetail.db.update,
          logger.logType.debug,
          `Successfully updated Id: ${updatedReq.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query =
      moduleScripts.batchdetail.fetchAll + moduleScripts.batchdetail.fetchById

    sql.query(query, [tenantId, id], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.batchdetail.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  findById.' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.batchdetail.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.batchdetail.db.fetchById}`,
          logger.logType.error,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (req, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.batchdetail.create
    let reqId = uuidv4()

    sql.query(
      query,
      [
        reqId,
        req.BatchNo,
        req.Barcode,
        req.MfgDate,
        req.Expdate,
        req.PurchaseDate,
        req.IsNonReturnable,
        req.CostInfoId,
        req.UOMId,
        req.Quantity,
        req.MapProviderLocationMapperId,
        req.BranchDetailId,
        req.TenantId,
        req.Active,
        req.CreatedOn,
        req.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            req.TenantId,
            username,
            moduleNames.batchdetail.db.create,
            logger.logType.error,
            `Error while creating record for ${req.BatchNo}-${req.BranchDetailId}, Error Code: ${err.code} , Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          req.TenantId,
          username,
          moduleNames.batchdetail.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${reqId}`
        )
        resolve(reqId)
      }
    )
  })
}
