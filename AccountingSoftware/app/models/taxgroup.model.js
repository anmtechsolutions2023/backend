const { v4: uuidv4 } = require('uuid')
const logger = require('../utils/loggerHelper')
const moduleNames = require('../config/modulenames')
const moduleScripts = require('../../Scripts/modelscripts.js')
const mysqlConnection = require('../utils/db.js')
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
    moduleScripts.taxgroup.delete,
    moduleNames.taxgroup.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.taxgroup.fetchAll,
    moduleNames.taxgroup.db.fetchAll
  )
}

exports.findById = async (id, tenantId, username, callerModule) => {
  return await getFindById.findById(
    id,
    tenantId,
    username,
    moduleScripts.taxgroup.fetchById,
    `${callerModule}--${moduleNames.taxgroup.db.fetchById}`
  )
}

exports.update = async (taxGroup, username) => {
  try {
    const query = moduleScripts.taxgroup.update

    await mysqlConnection.query(query, [
      taxGroup.Name,
      taxGroup.Active,
      taxGroup.UpdatedOn,
      taxGroup.UpdatedBy,
      taxGroup.Id,
      taxGroup.TenantId,
    ])

    logger.loggerHelper(
      taxGroup.TenantId,
      username,
      moduleNames.taxgroup.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: taxGroup.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      taxGroup.TenantId,
      username,
      moduleNames.taxgroup.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: taxGroup.Id,
        code: err.code,
        message: err,
      })
    )
  }
}

exports.create = async (taxGroup, username) => {
  try {
    let query = moduleScripts.taxgroup.create
    let taxGroupId = uuidv4()

    await mysqlConnection.query(query, [
      taxGroupId,
      taxGroup.Name,
      taxGroup.Active,
      taxGroup.TenantId,
      taxGroup.CreatedOn,
      taxGroup.CreatedBy,
    ])

    logger.loggerHelper(
      taxGroup.TenantId,
      username,
      moduleNames.taxgroup.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: taxGroupId })
    )

    return taxGroupId
  } catch (err) {
    logger.loggerHelper(
      taxGroup.TenantId,
      username,
      moduleNames.taxgroup.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: taxGroup.Name,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError(err)
  }
}
