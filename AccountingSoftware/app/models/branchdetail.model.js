const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.branchdetail.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchdetail.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchdetail.db.delete,
          logger.logType.debug,
          `Deleted record Id: ${id}, affected Rows are: ${res.affectedRows} `
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchdetail.db.delete,
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
    let query = moduleScripts.branchdetail.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchdetail.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.branchdetail.db.fetchAll,
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
      case 'OrganizationDetailId':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND OrganizationDetailId = ?'
        break
      case 'ContactDetailId':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND ContactDetailId = ?'
        break
      case 'AddressDetailId':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND AddressDetailId = ?'
        break
      case 'BranchName':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND BranchName = ?'
        break
      case 'TINNo':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND TINNo = ?'
        break
      case 'GSTIN':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND GSTIN = ?'
        break
      case 'PAN':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND PAN = ?'
        break
      case 'CF1':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND CF1 = ?'
        break
      case 'CF2':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND CF2 = ?'
        break
      case 'CF3':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND CF3 = ?'
        break
      case 'CF4':
        query =
          moduleScripts.branchdetail.searchbyorganizationdetailid +
          ' AND CF4 = ?'
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchdetail.db.searchbyname,
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
          moduleNames.branchdetail.db.searchbyname,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  searchbyname.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.branchdetail.db.searchbyname,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.update = (updatedReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.branchdetail.update

    sql.query(
      query,
      [
        updatedReq.OrganizationDetailId,
        updatedReq.ContactDetailId,
        updatedReq.AddressDetailId,
        updatedReq.TransactionTypeConfigId,
        updatedReq.BranchName,
        updatedReq.TINNo,
        updatedReq.GSTIN,
        updatedReq.PAN,
        updatedReq.CF1,
        updatedReq.CF2,
        updatedReq.CF3,
        updatedReq.CF4,
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
            moduleNames.branchdetail.db.update,
            logger.logType.error,
            `Error for Id: ${updatedReq.Id}, Error code: ${err.code}, Error: ${err}`
          )
          return reject('DB Error, for operation:  update.' + err)
        }

        logger.loggerHelper(
          updatedReq.TenantId,
          username,
          moduleNames.branchdetail.db.update,
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
    let query = moduleScripts.branchdetail.fetchById

    sql.query(query, [tenantId, id], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.branchdetail.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  findById.' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.branchdetail.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.branchdetail.db.fetchById}`,
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
    let query = moduleScripts.branchdetail.create
    let reqId = uuidv4()

    sql.query(
      query,
      [
        reqId,
        req.OrganizationDetailId,
        req.ContactDetailId,
        req.AddressDetailId,
        req.TransactionTypeConfigId,
        req.BranchName,
        req.TINNo,
        req.GSTIN,
        req.PAN,
        req.CF1,
        req.CF2,
        req.CF3,
        req.CF4,
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
            moduleNames.branchdetail.db.create,
            logger.logType.error,
            `Error while creating record for ${req.OrganizationDetailId}-${req.BranchName}, Error Code: ${err.code} , Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          req.TenantId,
          username,
          moduleNames.branchdetail.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${reqId}`
        )
        resolve(reqId)
      }
    )
  })
}
