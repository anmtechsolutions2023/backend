const { v4: uuidv4 } = require('uuid')
const logger = require('../utils/loggerHelper.js')
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
    moduleScripts.transactiontypes.delete,
    moduleNames.transactiontypes.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.transactiontypes.fetchAll,
    moduleNames.transactiontypes.db.fetchAll
  )
}

exports.update = async (tt, username) => {
  try {
    const query = moduleScripts.transactiontypes.update

    await mysqlConnection.query(query, [
      tt.Name,
      tt.TransactionTypeConfigId,
      tt.Active,
      tt.UpdatedOn,
      tt.UpdatedBy,
      tt.Id,
      tt.TenantId,
    ])

    logger.loggerHelper(
      tt.TenantId,
      username,
      moduleNames.transactiontypes.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', {
        id: tt.TransactionTypeConfigId,
      })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      tt.TenantId,
      username,
      moduleNames.transactiontypes.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: tt.TransactionTypeConfigId,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}

exports.findById = async (id, tenantId, username, callerModule) => {
  return await getFindById.findById(
    id,
    tenantId,
    username,
    moduleScripts.transactiontypes.fetchById,
    `${callerModule}--${moduleNames.transactiontypes.db.fetchById}`
  )
}

exports.create = async (tt, username) => {
  try {
    const query = moduleScripts.transactiontypes.create
    const ttId = uuidv4()

    await mysqlConnection.query(query, [
      ttId,
      tt.Name,
      tt.TransactionTypeConfigId,
      tt.Active,
      tt.TenantId,
      tt.CreatedOn,
      tt.CreatedBy,
    ])

    logger.loggerHelper(
      tt.TenantId,
      username,
      moduleNames.transactiontypes.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: ttId })
    )

    return ttId
  } catch (err) {
    logger.loggerHelper(
      tt.TenantId,
      username,
      moduleNames.transactiontypes.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: tt.Name,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
