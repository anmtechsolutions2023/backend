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
    moduleScripts.organizationdetail.delete,
    moduleNames.organizationdetail.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.organizationdetail.fetchAll,
    moduleNames.organizationdetail.db.fetchAll
  )
}

exports.update = async (od, username) => {
  try {
    const query = moduleScripts.organizationdetail.update

    await mysqlConnection.query(query, [
      od.Name,
      od.Active,
      od.UpdatedOn,
      od.UpdatedBy,
      od.Id,
      od.TenantId,
    ])

    logger.loggerHelper(
      od.TenantId,
      username,
      moduleNames.organizationdetail.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: od.Name })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      od.TenantId,
      username,
      moduleNames.organizationdetail.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: od.Id,
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
    moduleScripts.organizationdetail.fetchById,
    `${callerModule}--${moduleNames.organizationdetail.db.fetchById}`
  )
}

exports.create = async (od, username) => {
  try {
    const query = moduleScripts.organizationdetail.create
    const odId = uuidv4()

    await mysqlConnection.query(query, [
      odId,
      od.Name,
      od.Active,
      od.TenantId,
      od.CreatedOn,
      od.CreatedBy,
    ])

    logger.loggerHelper(
      od.TenantId,
      username,
      moduleNames.organizationdetail.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: odId })
    )

    return odId
  } catch (err) {
    logger.loggerHelper(
      od.TenantId,
      username,
      moduleNames.organizationdetail.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: od.Name,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
