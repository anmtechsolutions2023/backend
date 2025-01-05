const { v4: uuidv4 } = require('uuid')
const mysqlConnection = require('../utils/db.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes.js')
const getAllModels = require('../models/common/getAll.model')
const getFindById = require('../models/common/findById.model')
const deleteById = require('../models/common/deleteById.model')
const handleDatabaseError = require('../common/errorhandle.common')
const i18n = require('../utils/i18n')

exports.deleteById = async (id, tenantId, username) => {
  return await deleteById.deleteById(
    id,
    tenantId,
    username,
    moduleScripts.contactdetail.delete,
    moduleNames.contactdetail.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.contactdetail.fetchAll,
    moduleNames.contactdetail.db.fetchAll
  )
}

exports.searchByParam = async (tenantId, username, queryParams) => {
  try {
    let query = null
    switch (queryParams.QueryParamName) {
      case 'FirstName':
        query = moduleScripts.contactdetail.searchbyfirstname
        break
      case 'LastName':
        query = moduleScripts.contactdetail.searchbylastname
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactdetail.db.searchbyname,
          logger.logType.error,
          i18n.__('messages.modules.contactdetail.queryParamNotSupported')
        )
        return statusCodes.HTTP_STATUS_BAD_REQUEST
      }
    }

    const [res] = await mysqlConnection.query(query, [
      tenantId,
      queryParams.QueryParamValue,
    ])

    logger.loggerHelper(
      tenantId,
      username,
      moduleNames.contactdetail.db.searchbyname,
      logger.logType.debug,
      i18n.__('messages.logger.recordFindByQueryParam')
    )

    return res
  } catch (err) {
    logger.loggerHelper(
      tenantId,
      username,
      moduleNames.contactdetail.db.searchbyname,
      logger.logType.error,
      i18n.__('messages.logger.errorSearchParam', {
        code: err.code,
        message: err,
      })
    )
    throw handleDatabaseError.handleDatabaseError(err)
  }
}

exports.update = async (cdReq, username) => {
  try {
    let query = moduleScripts.contactdetail.update

    await mysqlConnection.query(query, [
      cdReq.FirstName,
      cdReq.LastName,
      cdReq.MobileNo,
      cdReq.AltMobileNo,
      cdReq.Landline1,
      cdReq.Landline2,
      cdReq.Ext1,
      cdReq.Ext2,
      cdReq.ContactAddressTypeId,
      cdReq.Active,
      cdReq.UpdatedOn,
      cdReq.UpdatedBy,
      cdReq.Id,
      cdReq.TenantId,
    ])

    logger.loggerHelper(
      cdReq.TenantId,
      username,
      moduleNames.contactdetail.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: cdReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      cdReq.TenantId,
      username,
      moduleNames.contactdetail.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: cdReq.Id,
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
    moduleScripts.contactdetail.fetchById,
    `${callerModule}--${moduleNames.contactdetail.db.fetchById}`
  )
}

exports.create = async (cdReq, username) => {
  try {
    let query = moduleScripts.contactdetail.create
    let cdId = uuidv4()

    await mysqlConnection.query(query, [
      cdId,
      cdReq.FirstName,
      cdReq.LastName,
      cdReq.MobileNo,
      cdReq.AltMobileNo,
      cdReq.Landline1,
      cdReq.Landline2,
      cdReq.Ext1,
      cdReq.Ext2,
      cdReq.ContactAddressTypeId,
      cdReq.TenantId,
      cdReq.Active,
      cdReq.CreatedOn,
      cdReq.CreatedBy,
    ])

    logger.loggerHelper(
      cdReq.TenantId,
      username,
      moduleNames.contactdetail.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: cdId })
    )

    return cdId
  } catch (err) {
    logger.loggerHelper(
      cdReq.TenantId,
      username,
      moduleNames.contactdetail.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: cdReq.TaxGroupId,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
