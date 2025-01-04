const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const mysqlConnection = require('../utils/db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')
const statusCodes = require('../config/statusCodes.js')
const getAllModels = require('../models/common/getAll.model')
const getFindById = require('../models/common/findById.model')
const deleteById = require('../models/common/deleteById.model')
const handleDatabaseError = require('../common/errorhandle.common')
const i18n = require('../utils/i18n')

exports.deleteById = async (id, tenantId, username) => {
  return await deleteById.deleteById(
    id,
    tenantId,
    username,
    moduleScripts.contactaddresstype.delete,
    moduleNames.contactaddresstype.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.contactaddresstype.fetchAll,
    moduleNames.contactaddresstype.db.fetchAll
  )
}

exports.findById = async (id, tenantId, username, callerModule) => {
  return await getFindById.findById(
    id,
    tenantId,
    username,
    moduleScripts.contactaddresstype.fetchById,
    `${callerModule}--${moduleNames.contactaddresstype.db.fetchById}`
  )
}

exports.update = async (cat, username) => {
  try {
    let query = moduleScripts.contactaddresstype.update

    sql.query(query, [
      cat.Name,
      cat.Active,
      cat.UpdatedOn,
      cat.UpdatedBy,
      cat.Id,
      cat.TenantId,
    ])
    logger.loggerHelper(
      cat.TenantId,
      username,
      moduleNames.contactaddresstype.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: cat.TenantId })
    )
    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      cat.TenantId,
      username,
      moduleNames.contactaddresstype.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: cat.TenantId,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError(err)
  }
}

exports.create = async (cat, username) => {
  try {
    let query = moduleScripts.contactaddresstype.create
    let catId = uuidv4()

    await mysqlConnection.query(query, [
      catId,
      cat.Name,
      cat.Active,
      cat.TenantId,
      cat.CreatedOn,
      cat.CreatedBy,
    ])

    logger.loggerHelper(
      cat.TenantId,
      username,
      moduleNames.contactaddresstype.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: catId })
    )
    return catId
  } catch (err) {
    logger.loggerHelper(
      cat.TenantId,
      username,
      moduleNames.contactaddresstype.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: cat.Name,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError(err)
  }
}
