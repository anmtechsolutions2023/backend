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
    moduleScripts.batchdetail.delete,
    moduleNames.batchdetail.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.batchdetail.fetchAll,
    moduleNames.batchdetail.db.fetchAll
  )
}

exports.searchByParam = async (tenantId, username, queryParams) => {
  try {
    let query = null

    switch (queryParams.QueryParamName) {
      case 'BatchNo':
        query = moduleScripts.batchdetail.fetchAll + ' AND BatchNo = ?'
        break
      case 'Barcode':
        query = moduleScripts.batchdetail.fetchAll + ' AND Barcode = ?'
        break
      case 'MfgDate':
        query = moduleScripts.batchdetail.fetchAll + ' AND MfgDate = ?'
        break
      case 'Expdate':
        query = moduleScripts.batchdetail.fetchAll + ' AND Expdate = ?'
        break
      case 'PurchaseDate':
        query = moduleScripts.batchdetail.fetchAll + ' AND PurchaseDate = ?'
        break
      case 'IsNonReturnable':
        query = moduleScripts.batchdetail.fetchAll + ' AND IsNonReturnable = ?'
        break
      case 'CostInfoId':
        query = moduleScripts.batchdetail.fetchAll + ' AND CostInfoId = ?'
        break
      case 'UOMId':
        query = moduleScripts.batchdetail.fetchAll + ' AND UOMId = ?'
        break
      case 'Quantity':
        query = moduleScripts.batchdetail.fetchAll + ' AND Quantity = ?'
        break
      case 'MapProviderLocationMapperId':
        query =
          moduleScripts.batchdetail.fetchAll +
          ' AND MapProviderLocationMapperId = ?'
        break
      case 'BranchDetailId':
        query = moduleScripts.batchdetail.fetchAll + ' AND BranchDetailId = ?'
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.batchdetail.db.searchbyname,
          logger.logType.error,
          i18n.__('messages.modules.batchdetail.queryParamNotSupported')
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
      moduleNames.batchdetail.db.searchbyname,
      logger.logType.debug,
      i18n.__('messages.logger.recordFindByQueryParam')
    )

    return res
  } catch (err) {
    logger.loggerHelper(
      tenantId,
      username,
      moduleNames.batchdetail.db.searchbyname,
      logger.logType.error,
      i18n.__('messages.logger.errorSearchParam', {
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}

exports.update = async (updatedReq, username) => {
  try {
    const query = moduleScripts.batchdetail.update

    await mysqlConnection.query(query, [
      updatedReq.BatchNo,
      updatedReq.Barcode,
      updatedReq.MfgDate,
      updatedReq.Expdate,
      updatedReq.PurchaseDate,
      updatedReq.IsNonReturnable,
      updatedReq.CostInfoId,
      updatedReq.UOMId,
      updatedReq.Quantity,
      updatedReq.MapProviderLocationMapperId,
      updatedReq.BranchDetailId,
      updatedReq.Active,
      updatedReq.UpdatedOn,
      updatedReq.UpdatedBy,
      updatedReq.Id,
      updatedReq.TenantId,
    ])

    logger.loggerHelper(
      updatedReq.TenantId,
      username,
      moduleNames.batchdetail.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: updatedReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      updatedReq.TenantId,
      username,
      moduleNames.batchdetail.db.update,
      logger.logType.error,
      i18n.__('messages.logger.errorUpdatedById', {
        id: updatedReq.Id,
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
    moduleScripts.batchdetail.fetchById,
    `${callerModule}--${moduleNames.batchdetail.db.fetchById}`
  )
}

exports.create = async (req, username) => {
  try {
    const query = moduleScripts.batchdetail.create
    const reqId = uuidv4()

    await mysqlConnection.query(query, [
      reqId,
      req.BatchNo,
      req.Barcode,
      req.MfgDate,
      req.Expdate,
      req.PurchaseDate,
      req.IsNonReturnable,
      req.CostInfoId,
      req.UOMId,
      req.Quantity,
      req.MapProviderLocationMapperId,
      req.BranchDetailId,
      req.TenantId,
      req.Active,
      req.CreatedOn,
      req.CreatedBy,
    ])

    logger.loggerHelper(
      req.TenantId,
      username,
      moduleNames.batchdetail.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: reqId })
    )

    return reqId
  } catch (err) {
    logger.loggerHelper(
      req.TenantId,
      username,
      moduleNames.batchdetail.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: `${req.BatchNo}-${req.BranchDetailId}`,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
