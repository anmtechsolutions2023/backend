const paymentdetailmodel = require('../models/paymentdetail.model')
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

    const findById = await paymentdetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentdetail.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__(
          'messages.modules.paymentdetailpaymentdetail.notFound'
        ),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      AccountTypeBaseId: helper.updateFieldValue(
        findById,
        req.body.AccountTypeBaseId
      ),
      TransactionDetailLogId: helper.updateFieldValue(
        findById,
        req.body.TransactionDetailLogId
      ),
      DiscountAmount: helper.updateFieldValue(
        findById,
        req.body.DiscountAmount
      ),
      RoundOff: helper.updateFieldValue(findById, req.body.RoundOff),
      TotalAmount: helper.updateFieldValue(findById, req.body.TotalAmount),
      TaxesAmount: helper.updateFieldValue(findById, req.body.TaxesAmount),
      GrossAmount: helper.updateFieldValue(findById, req.body.GrossAmount),
      UserId: helper.updateFieldValue(findById, req.body.UserId),
      Active: helper.updateFieldValue(findById, req.body.Active),
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await paymentdetailmodel.update(updatedReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentdetail.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await paymentdetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentdetail.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.paymentdetail.notFound'),
      })
    }

    await paymentdetailmodel.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentdetail.internalServerError',
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

    const resp = await paymentdetailmodel.searchByParam(
      tenantId,
      username,
      params
    )

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.paymentdetail.queryParamNotSupported'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentdetail.internalServerError',
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
        translateResponse(await paymentdetailmodel.getAll(tenantId, username))
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentdetail.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let respObject = {
      Id: resp.Id,
      AccountTypeBaseId: resp.AccountTypeBaseId,
      TransactionDetailLogId: resp.TransactionDetailLogId,
      DiscountAmount: resp.DiscountAmount,
      RoundOff: resp.RoundOff,
      TotalAmount: resp.TotalAmount,
      TaxesAmount: resp.TaxesAmount,
      GrossAmount: resp.GrossAmount,
      UserId: resp.UserId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let accounttypebase = {
      Id: resp.AccountTypeBaseId,
      Name: resp.AccountTypeBaseName,
      Active: resp.AccountTypeBaseActive,
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

    respObject.accounttypebase = accounttypebase
    respObject.transactiondetaillog = transactiondetaillog

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await paymentdetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentdetail.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.paymentdetail.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentdetail.internalServerError',
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
      AccountTypeBaseId: req.body.AccountTypeBaseId,
      TransactionDetailLogId: req.body.TransactionDetailLogId,
      DiscountAmount: req.body.DiscountAmount,
      RoundOff: req.body.RoundOff,
      TotalAmount: req.body.TotalAmount,
      TaxesAmount: req.body.TaxesAmount,
      GrossAmount: req.body.GrossAmount,
      UserId: req.body.UserId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await paymentdetailmodel.create(reqModel, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentdetail.internalServerError',
      res
    )
  }
}
