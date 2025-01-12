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
    moduleScripts.categorydetail.delete,
    moduleNames.categorydetail.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.categorydetail.fetchAll,
    moduleNames.categorydetail.db.fetchAll
  )
}

exports.update = async (cd, username) => {
  try {
    const query = moduleScripts.categorydetail.update

    await mysqlConnection.query(query, [
      cd.Name,
      cd.Active,
      cd.UpdatedOn,
      cd.UpdatedBy,
      cd.Id,
      cd.TenantId,
    ])

    logger.loggerHelper(
      cd.TenantId,
      username,
      moduleNames.categorydetail.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: cd.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      cd.TenantId,
      username,
      moduleNames.categorydetail.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: cd.Id,
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
    moduleScripts.categorydetail.fetchById,
    `${callerModule}--${moduleNames.categorydetail.db.fetchById}`
  )
}

exports.create = async (cd, username) => {
  try {
    const query = moduleScripts.categorydetail.create
    const cdId = uuidv4()

    await mysqlConnection.query(query, [
      cdId,
      cd.Name,
      cd.Active,
      cd.TenantId,
      cd.CreatedOn,
      cd.CreatedBy,
    ])

    logger.loggerHelper(
      cd.TenantId,
      username,
      moduleNames.categorydetail.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: cd.Name })
    )

    return cdId
  } catch (err) {
    logger.loggerHelper(
      cd.TenantId,
      username,
      moduleNames.categorydetail.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: cd.Name,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
