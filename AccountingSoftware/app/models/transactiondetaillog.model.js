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
    moduleScripts.transactiondetaillog.delete,
    moduleNames.transactiondetaillog.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.transactiondetaillog.fetchAll,
    moduleNames.transactiondetaillog.db.fetchAll
  )
}

exports.searchByParam = async (tenantId, username, queryParams) => {
  try {
    let query = null
    switch (queryParams.QueryParamName) {
      case 'AccountTypeBaseId':
        query =
          moduleScripts.transactiondetaillog.fetchAll +
          ' AND AccountTypeBaseId = ?'
        break
      case 'UserId':
        query = moduleScripts.transactiondetaillog.fetchAll + ' AND UserId = ?'
        break
      case 'BranchDetailId':
        query =
          moduleScripts.transactiondetaillog.fetchAll +
          ' AND BranchDetailId = ?'
        break
      case 'CF1':
        query = moduleScripts.transactiondetaillog.fetchAll + ' AND CF1 = ?'
        break
      case 'CF2':
        query = moduleScripts.transactiondetaillog.fetchAll + ' AND CF2 = ?'
        break
      case 'CF3':
        query = moduleScripts.transactiondetaillog.fetchAll + ' AND CF3 = ?'
        break
      case 'CF4':
        query = moduleScripts.transactiondetaillog.fetchAll + ' AND CF4 = ?'
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.transactiondetaillog.db.searchbyname,
          logger.logType.error,
          i18n.__(
            'messages.modules.transactiondetaillog.queryParamNotSupported'
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
      moduleNames.transactiondetaillog.db.searchbyname,
      logger.logType.debug,
      i18n.__('messages.logger.recordFindByQueryParam')
    )

    return res
  } catch (err) {
    logger.loggerHelper(
      tenantId,
      username,
      moduleNames.transactiondetaillog.db.searchbyname,
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
    const query = moduleScripts.transactiondetaillog.update

    await mysqlConnection.query(query, [
      updatedReq.AccountTypeBaseId,
      updatedReq.UserId,
      updatedReq.Description,
      updatedReq.BranchDetailId,
      updatedReq.CF1,
      updatedReq.CF2,
      updatedReq.CF3,
      updatedReq.CF4,
      updatedReq.Active,
      updatedReq.UpdatedOn,
      updatedReq.UpdatedBy,
      updatedReq.Id,
      updatedReq.TenantId,
    ])

    logger.loggerHelper(
      updatedReq.TenantId,
      username,
      moduleNames.transactiondetaillog.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: updatedReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      updatedReq.TenantId,
      username,
      moduleNames.transactiondetaillog.db.update,
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
    moduleScripts.transactiondetaillog.fetchById,
    `${callerModule}--${moduleNames.transactiondetaillog.db.fetchById}`
  )
}

exports.create = async (req, username) => {
  try {
    const query = moduleScripts.transactiondetaillog.create
    const reqId = uuidv4()

    await mysqlConnection.query(query, [
      reqId,
      req.AccountTypeBaseId,
      req.UserId,
      req.TransactionDateTime,
      req.Description,
      req.BranchDetailId,
      req.CF1,
      req.CF2,
      req.CF3,
      req.CF4,
      req.TenantId,
      req.Active,
      req.CreatedOn,
      req.CreatedBy,
    ])

    logger.loggerHelper(
      req.TenantId,
      username,
      moduleNames.transactiondetaillog.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: reqId })
    )

    return reqId
  } catch (err) {
    logger.loggerHelper(
      req.TenantId,
      username,
      moduleNames.transactiondetaillog.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: `${req.AccountTypeBaseId}-${req.BranchDetailId}`,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
