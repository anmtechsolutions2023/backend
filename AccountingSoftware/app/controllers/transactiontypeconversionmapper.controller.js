const transactiontypeconversionmappermodel = require('../models/transactiontypeconversionmapper.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const decodeToken = require('../utils/extracttoken')
const queryParams = require('../utils/queyParams')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')
const commonControllerErrorHandler = require('../common/errorhandle.common')

exports.update = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    const findById = await transactiontypeconversionmappermodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypeconversionmapper.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.contactdetail.notFound'),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      TransactionTypeBaseCoversionId: helper.updateFieldValue(
        findById,
        req.body.TransactionTypeBaseCoversionId
      ),
      TransactionDetailLogId: helper.updateFieldValue(
        findById,
        req.body.TransactionDetailLogId
      ),
      TransactionTypeStatusId: helper.updateFieldValue(
        findById,
        req.body.TransactionTypeStatusId
      ),
      Active: helper.updateFieldValue(findById, req.body.Active),
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(
        await transactiontypeconversionmappermodel.update(updatedReq, username)
      )
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconversionmapper.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await transactiontypeconversionmappermodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypeconversionmapper.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__(
          'messages.modules.transactiontypeconversionmapper.notFound'
        ),
      })
    }

    await transactiontypeconversionmappermodel.deleteById(
      req.params.id,
      tenantId,
      username
    )

    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconversionmapper.internalServerError',
      res
    )
  }
}

exports.search = async (req, res) => {
  try {
    const { tenantId, username } = req

    const params = queryParams.getQueryParams(req.query)

    const queryParamName = params['QueryParamName']
    const queryParamValue = params['QueryParamValue']

    if (helper.isEmpty(queryParamName) || helper.isEmpty(queryParamValue)) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.modules.contactdetail.queryParamMissing'),
      })
    }

    const resp = await transactiontypeconversionmappermodel.searchByParam(
      tenantId,
      username,
      params
    )

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.transactiontypeconversionmapper.queryParamNotSupported'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconversionmapper.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(
        translateResponse(
          await transactiontypeconversionmappermodel.getAll(tenantId, username)
        )
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconversionmapper.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let respObject = {
      Id: resp.Id,
      TransactionTypeBaseCoversionId: resp.TransactionTypeBaseCoversionId,
      TransactionDetailLogId: resp.TransactionDetailLogId,
      TransactionTypeStatusId: resp.TransactionTypeStatusId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let transactiontypebaseconversion = {
      Id: resp.TransactionTypeBaseCoversionId,
      FromTransactionTypeId:
        resp.TransactionTypeBaseCoversionFromTransactionTypeId,
      ToTransactionTypeId: resp.TransactionTypeBaseCoversionToTransactionTypeId,
      Active: resp.TransactionTypeBaseCoversionActive,
    }

    let transactiondetaillog = {
      Id: resp.TransactionDetailLogId,
      AccountTypeBaseId: resp.TransactionDetailLogAccountTypeBaseId,
      UserId: resp.TransactionDetailLogUserId,
      TransactionDateTime: resp.TransactionDetailLogTransactionDateTime,
      Description: resp.TransactionDetailLogDescription,
      BranchDetailId: resp.TransactionDetailLogBranchDetailId,
      CF1: resp.TransactionDetailLogCF1,
      CF2: resp.TransactionDetailLogCF2,
      CF3: resp.TransactionDetailLogCF3,
      CF4: resp.TransactionDetailLogCF4,
      Active: resp.TransactionDetailLogActive,
    }

    let transactiontypestatus = {
      Id: resp.TransactionTypeStatusId,
      Name: resp.TransactionTypeStatusName,
      Active: resp.TransactionTypeStatusActive,
    }

    respObject.transactiondetaillog = transactiondetaillog
    respObject.transactiontypebaseconversion = transactiontypebaseconversion
    respObject.transactiontypestatus = transactiontypestatus

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await transactiontypeconversionmappermodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypeconversionmapper.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__(
          'messages.modules.transactiontypeconversionmapper.notFound'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconversionmapper.internalServerError',
      res
    )
  }
}

exports.create = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    // Create a Record
    const reqModel = {
      TransactionTypeBaseCoversionId: req.body.TransactionTypeBaseCoversionId,
      TransactionDetailLogId: req.body.TransactionDetailLogId,
      TransactionTypeStatusId: req.body.TransactionTypeStatusId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await transactiontypeconversionmappermodel.create(
      reqModel,
      username
    )

    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconversionmapper.internalServerError',
      res
    )
  }
}
