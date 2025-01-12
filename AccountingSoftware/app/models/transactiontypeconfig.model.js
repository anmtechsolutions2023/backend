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
    moduleScripts.transactiontypeconfig.delete,
    moduleNames.transactiontypeconfig.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.transactiontypeconfig.fetchAll,
    moduleNames.transactiontypeconfig.db.fetchAll
  )
}

exports.update = async (ttc, username) => {
  try {
    const query = moduleScripts.transactiontypeconfig.update

    await mysqlConnection.query(query, [
      ttc.StartCounterNo,
      ttc.Prefix,
      ttc.Format,
      ttc.Active,
      ttc.UpdatedOn,
      ttc.UpdatedBy,
      ttc.Id,
      ttc.TenantId,
    ])

    logger.loggerHelper(
      ttc.TenantId,
      username,
      moduleNames.transactiontypeconfig.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: ttc.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      ttc.TenantId,
      username,
      moduleNames.transactiontypeconfig.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: ttc.Id,
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
    moduleScripts.transactiontypeconfig.fetchById,
    `${callerModule}--${moduleNames.transactiontypeconfig.db.fetchById}`
  )
}

exports.create = async (ttc, username) => {
  try {
    const query = moduleScripts.transactiontypeconfig.create
    const ttcId = uuidv4()

    await mysqlConnection.query(query, [
      ttcId,
      ttc.StartCounterNo,
      ttc.Prefix,
      ttc.Format,
      ttc.Active,
      ttc.TenantId,
      ttc.CreatedOn,
      ttc.CreatedBy,
    ])

    logger.loggerHelper(
      ttc.TenantId,
      username,
      moduleNames.transactiontypeconfig.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: ttcId })
    )

    return ttcId
  } catch (err) {
    logger.loggerHelper(
      ttc.TenantId,
      username,
      moduleNames.transactiontypeconfig.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: ttc.StartCounterNo,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
