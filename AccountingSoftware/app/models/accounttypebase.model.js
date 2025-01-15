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
    moduleScripts.accounttypebase.delete,
    moduleNames.accounttypebase.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.accounttypebase.fetchAll,
    moduleNames.accounttypebase.db.fetchAll
  )
}

exports.findById = async (id, tenantId, username, callerModule) => {
  return await getFindById.findById(
    id,
    tenantId,
    username,
    moduleScripts.accounttypebase.fetchById,
    `${callerModule}--${moduleNames.accounttypebase.db.fetchById}`
  )
}

exports.update = async (atb, username) => {
  try {
    const query = moduleScripts.accounttypebase.update

    await mysqlConnection.query(query, [
      atb.Name,
      atb.Active,
      atb.UpdatedOn,
      atb.UpdatedBy,
      atb.Id,
      atb.TenantId,
    ])

    logger.loggerHelper(
      atb.TenantId,
      username,
      moduleNames.accounttypebase.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: atb.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      atb.TenantId,
      username,
      moduleNames.accounttypebase.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: atb.Id,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}

exports.create = async (atb, username) => {
  try {
    const query = moduleScripts.accounttypebase.create
    const atbId = uuidv4()

    await mysqlConnection.query(query, [
      atbId,
      atb.Name,
      atb.Active,
      atb.TenantId,
      atb.CreatedOn,
      atb.CreatedBy,
    ])

    logger.loggerHelper(
      atb.TenantId,
      username,
      moduleNames.accounttypebase.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: atb.Name })
    )

    return atbId
  } catch (err) {
    logger.loggerHelper(
      atb.TenantId,
      username,
      moduleNames.accounttypebase.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: atb.Name,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
