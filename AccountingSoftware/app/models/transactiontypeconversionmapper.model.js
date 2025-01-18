const { v4: uuidv4 } = require('uuid')
const logger = require('../utils/loggerHelper.js')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames.js')
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
    moduleScripts.transactiontypeconversionmapper.delete,
    moduleNames.transactiontypeconversionmapper.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.transactiontypeconversionmapper.fetchAll,
    moduleNames.transactiontypeconversionmapper.db.fetchAll
  )
}

exports.searchByParam = async (tenantId, username, queryParams) => {
  try {
    let query = null
    switch (queryParams.QueryParamName) {
      case 'TransactionTypeBaseCoversionId':
        query =
          moduleScripts.transactiontypeconversionmapper.fetchAll +
          ' AND TransactionTypeBaseCoversionId = ?'
        break
      case 'TransactionDetailLogId':
        query =
          moduleScripts.transactiontypeconversionmapper.fetchAll +
          ' AND TransactionDetailLogId = ?'
        break
      case 'TransactionTypeStatusId':
        query =
          moduleScripts.transactiontypeconversionmapper.fetchAll +
          ' AND TransactionTypeStatusId = ?'
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiontypeconversionmapper.db.searchbyname,
          logger.logType.error,
          i18n.__(
            'messages.modules.transactiontypeconversionmapper.queryParamNotSupported'
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
      moduleNames.transactiontypeconversionmapper.db.searchbyname,
      logger.logType.debug,
      i18n.__('messages.logger.recordFindByQueryParam')
    )

    return res
  } catch (err) {
    logger.loggerHelper(
      tenantId,
      username,
      moduleNames.transactiontypeconversionmapper.db.searchbyname,
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
    const query = moduleScripts.transactiontypeconversionmapper.update

    await mysqlConnection.query(query, [
      updatedReq.TransactionTypeBaseCoversionId,
      updatedReq.TransactionDetailLogId,
      updatedReq.TransactionTypeStatusId,
      updatedReq.Active,
      updatedReq.UpdatedOn,
      updatedReq.UpdatedBy,
      updatedReq.Id,
      updatedReq.TenantId,
    ])

    logger.loggerHelper(
      updatedReq.TenantId,
      username,
      moduleNames.transactiontypeconversionmapper.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: updatedReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      updatedReq.TenantId,
      username,
      moduleNames.transactiontypeconversionmapper.db.update,
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
    moduleScripts.transactiontypeconversionmapper.fetchById,
    `${callerModule}--${moduleNames.transactiontypeconversionmapper.db.fetchById}`
  )
}

exports.create = async (req, username) => {
  try {
    const query = moduleScripts.transactiontypeconversionmapper.create
    const reqId = uuidv4()

    await mysqlConnection.query(query, [
      reqId,
      req.TransactionTypeBaseCoversionId,
      req.TransactionDetailLogId,
      req.TransactionTypeStatusId,
      req.TenantId,
      req.Active,
      req.CreatedOn,
      req.CreatedBy,
    ])

    logger.loggerHelper(
      req.TenantId,
      username,
      moduleNames.transactiontypeconversionmapper.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: reqId })
    )

    return reqId
  } catch (err) {
    logger.loggerHelper(
      req.TenantId,
      username,
      moduleNames.transactiontypeconversionmapper.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: `${req.TransactionTypeBaseCoversionId}-${req.TransactionDetailLogId}`,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
