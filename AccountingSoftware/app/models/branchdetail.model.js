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
    moduleScripts.branchdetail.delete,
    moduleNames.branchdetail.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.branchdetail.fetchAll,
    moduleNames.branchdetail.db.fetchAll
  )
}

exports.searchByParam = async (tenantId, username, queryParams) => {
  try {
    let query = null

    switch (queryParams.QueryParamName) {
      case 'OrganizationDetailId':
        query =
          moduleScripts.branchdetail.searchbyparam +
          ' AND OrganizationDetailId = ?'
        break
      case 'ContactDetailId':
        query =
          moduleScripts.branchdetail.searchbyparam + ' AND ContactDetailId = ?'
        break
      case 'AddressDetailId':
        query =
          moduleScripts.branchdetail.searchbyparam + ' AND AddressDetailId = ?'
        break
      case 'BranchName':
        query = moduleScripts.branchdetail.searchbyparam + ' AND BranchName = ?'
        break
      case 'TINNo':
        query = moduleScripts.branchdetail.searchbyparam + ' AND TINNo = ?'
        break
      case 'GSTIN':
        query = moduleScripts.branchdetail.searchbyparam + ' AND GSTIN = ?'
        break
      case 'PAN':
        query = moduleScripts.branchdetail.searchbyparam + ' AND PAN = ?'
        break
      case 'CF1':
        query = moduleScripts.branchdetail.searchbyparam + ' AND CF1 = ?'
        break
      case 'CF2':
        query = moduleScripts.branchdetail.searchbyparam + ' AND CF2 = ?'
        break
      case 'CF3':
        query = moduleScripts.branchdetail.searchbyparam + ' AND CF3 = ?'
        break
      case 'CF4':
        query = moduleScripts.branchdetail.searchbyparam + ' AND CF4 = ?'
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.branchdetail.db.searchbyname,
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
      moduleNames.branchdetail.db.searchbyname,
      logger.logType.debug,
      i18n.__('messages.logger.recordFindByQueryParam')
    )

    return res
  } catch (err) {
    logger.loggerHelper(
      tenantId,
      username,
      moduleNames.branchdetail.db.searchbyname,
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
    const query = moduleScripts.branchdetail.update

    await mysqlConnection.query(query, [
      updatedReq.OrganizationDetailId,
      updatedReq.ContactDetailId,
      updatedReq.AddressDetailId,
      updatedReq.TransactionTypeConfigId,
      updatedReq.BranchName,
      updatedReq.TINNo,
      updatedReq.GSTIN,
      updatedReq.PAN,
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
      moduleNames.branchdetail.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: updatedReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      updatedReq.TenantId,
      username,
      moduleNames.branchdetail.db.update,
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
    moduleScripts.branchdetail.fetchById,
    `${callerModule}--${moduleNames.branchdetail.db.fetchById}`
  )
}

exports.create = async (req, username) => {
  try {
    const query = moduleScripts.branchdetail.create
    const reqId = uuidv4()

    await mysqlConnection.query(query, [
      reqId,
      req.OrganizationDetailId,
      req.ContactDetailId,
      req.AddressDetailId,
      req.TransactionTypeConfigId,
      req.BranchName,
      req.TINNo,
      req.GSTIN,
      req.PAN,
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
      moduleNames.branchdetail.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: reqId })
    )

    return reqId
  } catch (err) {
    logger.loggerHelper(
      req.TenantId,
      username,
      moduleNames.branchdetail.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: `${req.OrganizationDetailId}-${req.BranchName}`,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
