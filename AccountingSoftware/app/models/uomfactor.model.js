const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
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
    moduleScripts.uomfactor.delete,
    moduleNames.uomfactor.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.uomfactor.fetchAll,
    moduleNames.uomfactor.db.fetchAll
  )
}

exports.update = async (uomf, username) => {
  try {
    let query = moduleScripts.uomfactor.update

    await mysqlConnection.query(query, [
      uomf.PrimaryUOMId,
      uomf.SecondaryUOMId,
      uomf.Factor,
      uomf.Active,
      uomf.UpdatedOn,
      uomf.UpdatedBy,
      uomf.Id,
      uomf.TenantId,
    ])

    logger.loggerHelper(
      uomf.TenantId,
      username,
      moduleNames.uomfactor.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: uomf.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      uomf.TenantId,
      username,
      moduleNames.uomfactor.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: uomf.PrimaryUOMId,
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
    moduleScripts.uomfactor.fetchById,
    `${callerModule}--${moduleNames.uomfactor.db.fetchById}`
  )
}

exports.create = async (uomf, username) => {
  try {
    let query = moduleScripts.uomfactor.create
    let uomfId = uuidv4()

    await mysqlConnection.query(query, [
      uomfId,
      uomf.PrimaryUOMId,
      uomf.SecondaryUOMId,
      uomf.Factor,
      uomf.Active,
      uomf.TenantId,
      uomf.CreatedOn,
      uomf.CreatedBy,
    ])

    logger.loggerHelper(
      uomf.TenantId,
      username,
      moduleNames.uomfactor.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: uomfId })
    )

    return uomfId
  } catch (err) {
    logger.loggerHelper(
      uomf.TenantId,
      username,
      moduleNames.uomfactor.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: uomf.Factor,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError(err)
  }
}
