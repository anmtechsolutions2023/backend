const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
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
    moduleScripts.itemdetail.delete,
    moduleNames.itemdetail.db.delete
  )
}

exports.getAll = async (tenantId, username) => {
  return await getAllModels.getAll(
    tenantId,
    username,
    moduleScripts.itemdetail.fetchAll,
    moduleNames.itemdetail.db.fetchAll
  )
}

// exports.searchByParam = (tenantId, username, queryParams) => {
//   let query = null

//   return new Promise((resolve, reject) => {
//     switch (queryParams.QueryParamName) {
//       case 'Type':
//         query = moduleScripts.itemdetail.fetchAll + ' AND Type = ?'
//         break
//       case 'HSNCode':
//         query = moduleScripts.itemdetail.fetchAll + ' AND HSNCode = ?'
//         break
//       case 'SKU':
//         query = moduleScripts.itemdetail.fetchAll + ' AND SKU = ?'
//         break
//       case 'BatchDetailId':
//         query = moduleScripts.itemdetail.fetchAll + ' AND BatchDetailId = ?'
//         break
//       case 'CategoryId':
//         query = moduleScripts.itemdetail.fetchAll + ' AND CategoryId = ?'
//         break
//       default: {
//         logger.loggerHelper(
//           tenantId,
//           username,
//           moduleNames.itemdetail.db.searchbyname,
//           logger.logType.error,
//           `Not supported query param.`
//         )
//         return reject(statuses.Statuses.BadRequest)
//       }
//     }

//     sql.query(query, [tenantId, queryParams.QueryParamValue], (err, res) => {
//       if (err) {
//         logger.loggerHelper(
//           tenantId,
//           username,
//           moduleNames.itemdetail.db.searchbyname,
//           logger.logType.error,
//           `Error Code: ${err.code}, Error: ${err}`
//         )
//         return reject('DB Error, for operation:  searchbyname.' + err)
//       }

//       logger.loggerHelper(
//         tenantId,
//         username,
//         moduleNames.itemdetail.db.searchbyname,
//         logger.logType.debug,
//         `Success`
//       )
//       resolve(res)
//     })
//   })
// }

exports.searchByParam = async (tenantId, username, queryParams) => {
  try {
    let query = null
    switch (queryParams.QueryParamName) {
      case 'Type':
        query = moduleScripts.itemdetail.fetchAll + ' AND Type = ?'
        break
      case 'HSNCode':
        query = moduleScripts.itemdetail.fetchAll + ' AND HSNCode = ?'
        break
      case 'SKU':
        query = moduleScripts.itemdetail.fetchAll + ' AND SKU = ?'
        break
      case 'BatchDetailId':
        query = moduleScripts.itemdetail.fetchAll + ' AND BatchDetailId = ?'
        break
      case 'CategoryId':
        query = moduleScripts.itemdetail.fetchAll + ' AND CategoryId = ?'
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.itemdetail.db.searchbyname,
          logger.logType.error,
          i18n.__('messages.modules.itemdetail.queryParamNotSupported')
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
      moduleNames.itemdetail.db.searchbyname,
      logger.logType.debug,
      i18n.__('messages.logger.recordFindByQueryParam')
    )

    return res
  } catch (err) {
    logger.loggerHelper(
      tenantId,
      username,
      moduleNames.itemdetail.db.searchbyname,
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
    const query = moduleScripts.itemdetail.update

    await mysqlConnection.query(query, [
      updatedReq.Type,
      updatedReq.HSNCode,
      updatedReq.SKU,
      updatedReq.BatchDetailId,
      updatedReq.CategoryId,
      updatedReq.Description,
      updatedReq.Active,
      updatedReq.UpdatedOn,
      updatedReq.UpdatedBy,
      updatedReq.Id,
      updatedReq.TenantId,
    ])

    logger.loggerHelper(
      updatedReq.TenantId,
      username,
      moduleNames.itemdetail.db.update,
      logger.logType.debug,
      i18n.__('messages.logger.successUpdatedById', { id: updatedReq.Id })
    )

    return statusCodes.HTTP_STATUS_OK
  } catch (err) {
    logger.loggerHelper(
      updatedReq.TenantId,
      username,
      moduleNames.itemdetail.db.update,
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
    moduleScripts.itemdetail.fetchById,
    `${callerModule}--${moduleNames.itemdetail.db.fetchById}`
  )
}

exports.create = async (req, username) => {
  try {
    const query = moduleScripts.itemdetail.create
    const reqId = uuidv4()

    await mysqlConnection.query(query, [
      reqId,
      req.Type,
      req.HSNCode,
      req.SKU,
      req.BatchDetailId,
      req.CategoryId,
      req.Description,
      req.TenantId,
      req.Active,
      req.CreatedOn,
      req.CreatedBy,
    ])

    logger.loggerHelper(
      req.TenantId,
      username,
      moduleNames.itemdetail.db.create,
      logger.logType.debug,
      i18n.__('messages.logger.successCreatedById', { id: reqId })
    )

    return reqId
  } catch (err) {
    logger.loggerHelper(
      req.TenantId,
      username,
      moduleNames.itemdetail.db.create,
      logger.logType.error,
      i18n.__('messages.logger.errorCreatedById', {
        name: `${req.Type}-${req.BatchDetailId}`,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
