const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.branchusergroupmapper.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchusergroupmapper.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchusergroupmapper.db.delete,
          logger.logType.debug,
          `Deleted record Id: ${id}, affected Rows are: ${res.affectedRows} `
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchusergroupmapper.db.delete,
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
    let query = moduleScripts.branchusergroupmapper.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchusergroupmapper.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.branchusergroupmapper.db.fetchAll,
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
      case 'BranchDetailId':
        query =
          moduleScripts.branchusergroupmapper.fetchAll +
          ' AND BranchDetailId = ?'
        break
      case 'UserGroupId':
        query =
          moduleScripts.branchusergroupmapper.fetchAll + ' AND UserGroupId = ?'
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchusergroupmapper.db.searchbyname,
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
          moduleNames.branchusergroupmapper.db.searchbyname,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  searchbyname.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.branchusergroupmapper.db.searchbyname,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.update = (updatedReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.branchusergroupmapper.update

    sql.query(
      query,
      [
        updatedReq.BranchDetailId,
        updatedReq.UserGroupId,
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
            moduleNames.branchusergroupmapper.db.update,
            logger.logType.error,
            `Error for Id: ${updatedReq.Id}, Error code: ${err.code}, Error: ${err}`
          )
          return reject('DB Error, for operation:  update.' + err)
        }

        logger.loggerHelper(
          updatedReq.TenantId,
          username,
          moduleNames.branchusergroupmapper.db.update,
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
      moduleScripts.branchusergroupmapper.fetchAll +
      moduleScripts.branchusergroupmapper.fetchById

    sql.query(query, [tenantId, id], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.branchusergroupmapper.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  findById.' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.branchusergroupmapper.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.branchusergroupmapper.db.fetchById}`,
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
    let query = moduleScripts.branchusergroupmapper.create
    let reqId = uuidv4()

    sql.query(
      query,
      [
        reqId,
        req.BranchDetailId,
        req.UserGroupId,
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
            moduleNames.branchusergroupmapper.db.create,
            logger.logType.error,
            `Error while creating record for ${req.BranchDetailId}-${req.UserGroupId}, Error Code: ${err.code} , Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          req.TenantId,
          username,
          moduleNames.branchusergroupmapper.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${reqId}`
        )
        resolve(reqId)
      }
    )
  })
}
