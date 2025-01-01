const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const mysqlConnection = require('../utils/db.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes.js')
const getAllModels = require('../models/common/getAll.model')
const getFindById = require('../models/common/findById.model')
const deleteById = require('../models/common/deleteById.model')
const handleDatabaseError = require('../common/errorhandle.common')
const i18n = require('../utils/i18n')

exports.deleteUOM = async (id, tenantId, username) => {
  return await deleteById.deleteUOM(
    id,
    tenantId,
    username,
    moduleScripts.uom.delete,
    moduleNames.uom.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.uom.fetchAll,
    moduleNames.uom.db.fetchAll
  )
}

exports.update = async (uom, username) => {
  try {
    let query = moduleScripts.uom.update

    await mysqlConnection.query(query, [
      uom.UnitName,
      uom.IsPrimary,
      uom.Active,
      uom.UpdatedOn,
      uom.UpdatedBy,
      uom.Id,
      uom.TenantId,
    ])

    logger.loggerHelper(
      uom.TenantId,
      username,
      moduleNames.uom.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: uom.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      uom.TenantId,
      username,
      moduleNames.uom.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: uom.Id,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError(err)
  }
}

exports.findById = async (id, tenantId, username, callerModule) => {
  return await getFindById.findById(
    id,
    tenantId,
    username,
    moduleScripts.uom.fetchById,
    `${callerModule}--${moduleNames.uom.db.fetchById}`
  )
}

exports.create = async (uom, username) => {
  try {
    const query = moduleScripts.uom.create
    const uomId = uuidv4()

    await mysqlConnection.query(query, [
      uomId,
      uom.UnitName,
      uom.IsPrimary,
      uom.Active,
      uom.TenantId,
      uom.CreatedOn,
      uom.CreatedBy,
    ])

    logger.loggerHelper(
      uom.TenantId,
      username,
      moduleNames.uom.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: uomId })
    )

    return uomId
  } catch (err) {
    logger.loggerHelper(
      uom.TenantId,
      username,
      moduleNames.uom.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: uom.UnitName,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError(err)
  }
}
