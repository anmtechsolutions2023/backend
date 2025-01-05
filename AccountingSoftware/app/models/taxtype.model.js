const { v4: uuidv4 } = require('uuid')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')
const statusCodes = require('../config/statusCodes.js')
const getAllModels = require('../models/common/getAll.model')
const getFindById = require('../models/common/findById.model')
const deleteById = require('../models/common/deleteById.model')
const handleDatabaseError = require('../common/errorhandle.common')
const i18n = require('../utils/i18n')
const mysqlConnection = require('../utils/db.js')

exports.deleteById = async (id, tenantId, username) => {
  return await deleteById.deleteById(
    id,
    tenantId,
    username,
    moduleScripts.taxtypes.delete,
    moduleNames.taxtypes.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.taxtypes.fetchAll,
    moduleNames.taxtypes.db.fetchAll
  )
}

exports.findById = async (id, tenantId, username, callerModule) => {
  return await getFindById.findById(
    id,
    tenantId,
    username,
    moduleScripts.taxtypes.fetchById,
    `${callerModule}--${moduleNames.taxtypes.db.fetchById}`
  )
}

exports.update = async (taxType, username) => {
  try {
    let query = moduleScripts.taxtypes.update

    await mysqlConnection.query(query, [
      taxType.Name,
      taxType.Value,
      taxType.Active,
      taxType.UpdatedOn,
      taxType.UpdatedBy,
      taxType.Id,
      taxType.TenantId,
    ])

    logger.loggerHelper(
      taxType.TenantId,
      username,
      moduleNames.taxtypes.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: taxType.Id })
    )
    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      taxType.TenantId,
      username,
      moduleNames.taxtypes.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        name: taxType.Name,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}

exports.create = async (taxtype, username) => {
  try {
    let query = moduleScripts.taxtypes.create
    let taxTypeId = uuidv4()

    await mysqlConnection.query(query, [
      taxTypeId,
      taxtype.Name,
      taxtype.Value,
      taxtype.Active,
      taxtype.TenantId,
      taxtype.CreatedOn,
      taxtype.CreatedBy,
    ])

    logger.loggerHelper(
      taxtype.TenantId,
      username,
      moduleNames.taxtypes.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: taxTypeId })
    )

    return taxTypeId
  } catch (err) {
    logger.loggerHelper(
      taxtype.TenantId,
      username,
      moduleNames.taxtypes.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: taxtype.Name,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
