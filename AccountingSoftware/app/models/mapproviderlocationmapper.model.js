const { v4: uuidv4 } = require('uuid')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')
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
    moduleScripts.mapproviderlocationmapper.delete,
    moduleNames.mapproviderlocationmapper.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.mapproviderlocationmapper.fetchAll,
    moduleNames.mapproviderlocationmapper.db.fetchAll
  )
}

exports.update = async (mplmReq, username) => {
  try {
    let query = moduleScripts.mapproviderlocationmapper.update

    await mysqlConnection.query(query, [
      mplmReq.MapProviderId,
      mplmReq.LocationDetailId,
      mplmReq.Active,
      mplmReq.UpdatedOn,
      mplmReq.UpdatedBy,
      mplmReq.Id,
      mplmReq.TenantId,
    ])

    logger.loggerHelper(
      mplmReq.TenantId,
      username,
      moduleNames.mapproviderlocationmapper.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: mplmReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      mplmReq.TenantId,
      username,
      moduleNames.mapproviderlocationmapper.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: mplmReq.Id,
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
    moduleScripts.mapproviderlocationmapper.fetchById,
    `${callerModule}--${moduleNames.mapproviderlocationmapper.db.fetchById}`
  )
}

exports.create = async (mplmReq, username) => {
  try {
    const query = moduleScripts.mapproviderlocationmapper.create
    const mplmId = uuidv4()

    await mysqlConnection.query(query, [
      mplmId,
      mplmReq.MapProviderId,
      mplmReq.LocationDetailId,
      mplmReq.TenantId,
      mplmReq.Active,
      mplmReq.CreatedOn,
      mplmReq.CreatedBy,
    ])

    logger.loggerHelper(
      mplmReq.TenantId,
      username,
      moduleNames.mapproviderlocationmapper.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: mplmId })
    )

    return mplmId
  } catch (err) {
    logger.loggerHelper(
      mplmReq.TenantId,
      username,
      moduleNames.mapproviderlocationmapper.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: `${mplmReq.MapProviderId}-${mplmReq.LocationDetailId}`,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
