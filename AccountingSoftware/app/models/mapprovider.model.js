const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
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
const mysqlConnection = require('../utils/db.js')

exports.deleteById = async (id, tenantId, username) => {
  return await deleteById.deleteById(
    id,
    tenantId,
    username,
    moduleScripts.mapprovider.delete,
    moduleNames.mapprovider.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.mapprovider.fetchAll,
    moduleNames.mapprovider.db.fetchAll
  )
}

exports.findById = async (id, tenantId, username, callerModule) => {
  return await getFindById.findById(
    id,
    tenantId,
    username,
    moduleScripts.mapprovider.fetchById,
    `${callerModule}--${moduleNames.mapprovider.db.fetchById}`
  )
}

exports.update = async (mapProviderReq, username) => {
  try {
    const query = moduleScripts.mapprovider.update

    await mysqlConnection.query(query, [
      mapProviderReq.ProviderName,
      mapProviderReq.Active,
      mapProviderReq.UpdatedOn,
      mapProviderReq.UpdatedBy,
      mapProviderReq.Id,
      mapProviderReq.TenantId,
    ])

    logger.loggerHelper(
      mapProviderReq.TenantId,
      username,
      moduleNames.mapprovider.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: mapProviderReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      mapProviderReq.TenantId,
      username,
      moduleNames.mapprovider.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: mapProviderReq.Id,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}

exports.create = async (mapProviderReq, username) => {
  try {
    const query = moduleScripts.mapprovider.create
    const mapProviderId = uuidv4()

    await mysqlConnection.query(query, [
      mapProviderId,
      mapProviderReq.ProviderName,
      mapProviderReq.Active,
      mapProviderReq.TenantId,
      mapProviderReq.CreatedOn,
      mapProviderReq.CreatedBy,
    ])

    logger.loggerHelper(
      mapProviderReq.TenantId,
      username,
      moduleNames.mapprovider.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: mapProviderId })
    )

    return mapProviderId
  } catch (err) {
    logger.loggerHelper(
      mapProviderReq.TenantId,
      username,
      moduleNames.mapprovider.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: mapProviderReq.ProviderName,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
