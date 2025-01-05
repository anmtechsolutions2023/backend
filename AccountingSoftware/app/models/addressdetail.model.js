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
    moduleScripts.addressdetail.delete,
    moduleNames.addressdetail.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.addressdetail.fetchAll,
    moduleNames.addressdetail.db.fetchAll
  )
}

exports.update = async (adReq, username) => {
  try {
    let query = moduleScripts.addressdetail.update

    await mysqlConnection.query(query, [
      adReq.AddressLine1,
      adReq.AddressLine2,
      adReq.City,
      adReq.State,
      adReq.Pincode,
      adReq.MapProviderLocationMapperId,
      adReq.Landmark,
      adReq.ContactAddressTypeId,
      adReq.Active,
      adReq.UpdatedOn,
      adReq.UpdatedBy,
      adReq.Id,
      adReq.TenantId,
    ])

    logger.loggerHelper(
      adReq.TenantId,
      username,
      moduleNames.addressdetail.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: adReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      adReq.TenantId,
      username,
      moduleNames.addressdetail.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: adReq.Id,
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
    moduleScripts.addressdetail.fetchById,
    `${callerModule}--${moduleNames.addressdetail.db.fetchById}`
  )
}

exports.create = async (adReq, username) => {
  try {
    let query = moduleScripts.addressdetail.create
    let adId = uuidv4()

    await mysqlConnection.query(query, [
      adId,
      adReq.AddressLine1,
      adReq.AddressLine2,
      adReq.City,
      adReq.State,
      adReq.Pincode,
      adReq.MapProviderLocationMapperId,
      adReq.Landmark,
      adReq.ContactAddressTypeId,
      adReq.TenantId,
      adReq.Active,
      adReq.CreatedOn,
      adReq.CreatedBy,
    ])

    logger.loggerHelper(
      adReq.TenantId,
      username,
      moduleNames.addressdetail.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: adId })
    )
    return adId
  } catch (err) {
    logger.loggerHelper(
      adReq.TenantId,
      username,
      moduleNames.addressdetail.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: adReq.AddressLine1,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
