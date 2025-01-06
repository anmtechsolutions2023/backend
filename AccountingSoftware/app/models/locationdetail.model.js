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
    moduleScripts.locationdetail.delete,
    moduleNames.locationdetail.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.locationdetail.fetchAll,
    moduleNames.locationdetail.db.fetchAll
  )
}

exports.findById = async (id, tenantId, username, callerModule) => {
  return await getFindById.findById(
    id,
    tenantId,
    username,
    moduleScripts.locationdetail.fetchById,
    `${callerModule}--${moduleNames.locationdetail.db.fetchById}`
  )
}

exports.update = async (locationDetailReq, username) => {
  try {
    const query = moduleScripts.locationdetail.update

    await mysqlConnection.query(query, [
      locationDetailReq.Lat,
      locationDetailReq.Lng,
      locationDetailReq.CF1,
      locationDetailReq.CF2,
      locationDetailReq.CF3,
      locationDetailReq.CF4,
      locationDetailReq.Active,
      locationDetailReq.UpdatedOn,
      locationDetailReq.UpdatedBy,
      locationDetailReq.Id,
      locationDetailReq.TenantId,
    ])

    logger.loggerHelper(
      locationDetailReq.TenantId,
      username,
      moduleNames.locationdetail.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', {
        id: locationDetailReq.Id,
      })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      locationDetailReq.TenantId,
      username,
      moduleNames.locationdetail.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: locationDetailReq.Id,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}

exports.create = async (locationDetailReq, username) => {
  try {
    let query = moduleScripts.locationdetail.create
    let locationDetailId = uuidv4()

    await mysqlConnection.query(query, [
      locationDetailId,
      locationDetailReq.Lat,
      locationDetailReq.Lng,
      locationDetailReq.CF1,
      locationDetailReq.CF2,
      locationDetailReq.CF3,
      locationDetailReq.CF4,
      locationDetailReq.Active,
      locationDetailReq.TenantId,
      locationDetailReq.CreatedOn,
      locationDetailReq.CreatedBy,
    ])

    logger.loggerHelper(
      locationDetailReq.TenantId,
      username,
      moduleNames.locationdetail.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: locationDetailId })
    )

    return locationDetailId
  } catch (err) {
    logger.loggerHelper(
      locationDetailReq.TenantId,
      username,
      moduleNames.locationdetail.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: `${locationDetailReq.Lat}-${locationDetailReq.Lng}`,
        code: err.code,
        message: err,
      })
    )
    throw handleDatabaseError.handleDatabaseError(err)
  }
}
