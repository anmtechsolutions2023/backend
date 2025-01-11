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
    moduleScripts.taxgrouptaxtypemapper.delete,
    moduleNames.taxgrouptaxtypemapper.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.taxgrouptaxtypemapper.fetchAll,
    moduleNames.taxgrouptaxtypemapper.db.fetchAll
  )
}

exports.searchByParam = async (tenantId, username, queryParams) => {
  try {
    let query = null

    switch (queryParams.QueryParamName) {
      case 'TaxGroupName':
        query = moduleScripts.taxgrouptaxtypemapper.searchbytaxgroupname
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.taxgrouptaxtypemapper.db.searchbytaxgroupname,
          logger.logType.error,
          i18n.__(
            'messages.modules.taxgrouptaxtypemapper.queryParamNotSupported'
          )
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
      moduleNames.taxgrouptaxtypemapper.db.searchbytaxgroupname,
      logger.logType.debug,
      i18n.__('messages.logger.recordFindByQueryParam')
    )
    return res
  } catch (err) {
    logger.loggerHelper(
      tenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.db.searchbyparam,
      logger.logType.error,
      i18n.__('messages.logger.errorSearchParam', {
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}

exports.update = async (tgttmReq, username) => {
  try {
    const query = moduleScripts.taxgrouptaxtypemapper.update

    await mysqlConnection.query(query, [
      tgttmReq.TaxGroupId,
      tgttmReq.TaxTypeId,
      tgttmReq.Active,
      tgttmReq.UpdatedOn,
      tgttmReq.UpdatedBy,
      tgttmReq.Id,
      tgttmReq.TenantId,
    ])

    logger.loggerHelper(
      tgttmReq.TenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: tgttmReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      tgttmReq.TenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: tgttmReq.Id,
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
    moduleScripts.taxgrouptaxtypemapper.fetchById,
    `${callerModule}--${moduleNames.taxgrouptaxtypemapper.db.fetchById}`
  )
}

exports.create = async (tgttmReq, username) => {
  try {
    const query = moduleScripts.taxgrouptaxtypemapper.create
    const tgttmId = uuidv4()

    await mysqlConnection.query(query, [
      tgttmId,
      tgttmReq.TaxGroupId,
      tgttmReq.TaxTypeId,
      tgttmReq.TenantId,
      tgttmReq.Active,
      tgttmReq.CreatedOn,
      tgttmReq.CreatedBy,
    ])

    logger.loggerHelper(
      tgttmReq.TenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: tgttmId })
    )

    return tgttmId
  } catch (err) {
    logger.loggerHelper(
      tgttmReq.TenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: `${tgttmReq.TaxGroupId}-${tgttmReq.TaxTypeId}`,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
