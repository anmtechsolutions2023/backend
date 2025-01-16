const transactionitemdetail = require('../models/transactionitemdetail.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
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

    const findById = await transactionitemdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactionitemdetail.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactionitemdetail.notFound'),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      TransactionDetailLogId: helper.updateFieldValue(
        findById,
        req.body.TransactionDetailLogId
      ),
      ItemId: helper.updateFieldValue(findById, req.body.ItemId),
      Comment: helper.updateFieldValue(findById, req.body.Comment),
      Active: helper.updateFieldValue(findById, req.body.Active),
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await transactionitemdetail.update(updatedReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactionitemdetail.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await transactionitemdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactionitemdetail.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactionitemdetail.notFound'),
      })
    }

    await transactionitemdetail.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactionitemdetail.internalServerError',
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
        message: i18n.__(
          'messages.modules.transactionitemdetail.queryParamMissing'
        ),
      })
    }

    const resp = await transactionitemdetail.searchByParam(
      tenantId,
      username,
      params
    )

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.transactionitemdetail.queryParamNotSupported'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactionitemdetail.internalServerError',
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
          await transactionitemdetail.getAll(tenantId, username)
        )
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactionitemdetail.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let respObject = {
      Id: resp.Id,
      TransactionDetailLogId: resp.TransactionDetailLogId,
      ItemId: resp.ItemId,
      Comment: resp.Comment,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
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

    let itemdetail = {
      Id: resp.ItemDetailId,
      Type: resp.ItemDetailType,
      HSNCode: resp.ItemDetailHSNCode,
      SKU: resp.ItemDetailSKU,
      BatchDetailId: resp.ItemDetailBatchDetailId,
      CategoryId: resp.ItemDetailBatchCategoryId,
      Description: resp.ItemDetailDescription,
      Active: resp.ItemDetailActive,
    }

    respObject.transactiondetaillog = transactiondetaillog
    respObject.itemdetail = itemdetail

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await transactionitemdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactionitemdetail.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactionitemdetail.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactionitemdetail.internalServerError',
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
      TransactionDetailLogId: req.body.TransactionDetailLogId,
      ItemId: req.body.ItemId,
      Comment: req.body.Comment,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await transactionitemdetail.create(reqModel, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactionitemdetail.internalServerError',
      res
    )
  }
}
