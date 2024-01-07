const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper.js')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')

exports.deleteCategoryDetail = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.categorydetail.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.categorydetail.db.delete,
          logger.logType.error,
          `Error occurred for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB CategoryDetail Error, for operation:  deleteCategoryDetail.' + err
        )
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.categorydetail.db.delete,
          logger.logType.debug,
          `Deleted record for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.categorydetail.db.delete,
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
    let query = moduleScripts.categorydetail.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.categorydetail.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB CategroryDetail Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.categorydetail.db.fetchAll,
        logger.logType.debug,
        'Success'
      )
      resolve(res)
    })
  })
}

exports.update = (cd, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.categorydetail.update

    sql.query(
      query,
      [cd.Name, cd.Active, cd.UpdatedOn, cd.UpdatedBy, cd.Id, cd.TenantId],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            cd.TenantId,
            username,
            moduleNames.categorydetail.db.update,
            logger.logType.error,
            `Error occurred for Id: ${cd.Id}, Error Code: ${err.code}, Error: ${err}`
          )
          return reject(
            'DB CategoryDetail Error, for operation:  update.' + err
          )
        }

        logger.loggerHelper(
          cd.TenantId,
          username,
          moduleNames.categorydetail.db.update,
          logger.logType.debug,
          `Record updated for Id: ${cd.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.categorydetail.fetchById

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.categorydetail.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject(
          'DB CategoryDetail Error, for operation:  findById.' + err
        )
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.categorydetail.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.categorydetail.db.fetchById}`,
          logger.logType.error,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (cd, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.categorydetail.create
    let cdId = uuidv4()

    sql.query(
      query,
      [cdId, cd.Name, cd.Active, cd.TenantId, cd.CreatedOn, cd.CreatedBy],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            cd.TenantId,
            username,
            moduleNames.categorydetail.db.create,
            logger.logType.error,
            `Error occurred for category name: ${cd.Name}, Error Code, ${err.code}, Error: ${err}`
          )
          return reject(
            'DB CategoryDetail Error, for operation:  create.' + err
          )
        }

        logger.loggerHelper(
          cd.TenantId,
          username,
          moduleNames.categorydetail.db.create,
          logger.logType.debug,
          `Record created for category name ${cd.Name}`
        )
        resolve(cdId)
      }
    )
  })
}
