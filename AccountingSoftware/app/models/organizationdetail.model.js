const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper.js')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.organizationdetail.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.organizationdetail.db.delete,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code} , Error: ${err} `
        )
        return reject(
          'DB OrganizationDetail Error, for operation:  delete.' + err
        )
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.organizationdetail.db.delete,
          logger.logType.debug,
          `Record deleted for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.organizationdetail.db.delete,
          logger.logType.error,
          `No record found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.getAll = (tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.organizationdetail.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.organizationdetail.db.fetchAll,
          logger.logType.error,
          `Error code: ${err.code}, Error occurred, Error: ${err}`
        )
        return reject(
          'DB OrganizationDetail Error, for operation:  getAll.' + err
        )
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.organizationdetail.db.fetchAll,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.update = (od, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.organizationdetail.update

    sql.query(
      query,
      [od.Name, od.Active, od.UpdatedOn, od.UpdatedBy, od.Id, od.TenantId],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            od.TenantId,
            username,
            moduleNames.organizationdetail.db.update,
            logger.logType.error,
            `Error Occurred for Id: ${od.Id}, Error code: ${err.code}, Error: ${err} `
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          od.TenantId,
          username,
          moduleNames.organizationdetail.db.update,
          logger.logType.debug,
          `Record updated for org name: ${od.Name} with Id: ${od.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.organizationdetail.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.organizationdetail.db.fetchById}`,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code} Error: ${err} `
        )
        return reject(
          'DB OrganizationDetail Error, for operation:  findById.' + err
        )
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.organizationdetail.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.organizationdetail.db.fetchById}`,
          logger.logType.debug,
          `Record not found for Id: ${id} `
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (od, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.organizationdetail.create
    let odId = uuidv4()

    sql.query(
      query,
      [odId, od.Name, od.Active, od.TenantId, od.CreatedOn, od.CreatedBy],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            od.TenantId,
            username,
            moduleNames.organizationdetail.db.create,
            logger.logType.error,
            `Error occurred for org name: ${od.Name}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          od.TenantId,
          username,
          moduleNames.organizationdetail.db.create,
          logger.logType.debug,
          `Record Created for org name: ${od.Name} with Id: ${odId}`
        )
        resolve(odId)
      }
    )
  })
}
