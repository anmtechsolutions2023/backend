const paymentbreakupmodel = require('../models/paymentbreakup.model')
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

    const findById = await paymentbreakupmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentbreakup.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.paymentbreakup.notFound'),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      AccountTypeBaseId: helper.updateFieldValue(
        findById,
        req.body.AccountTypeBaseId
      ),
      PaymentDetailId: helper.updateFieldValue(
        findById,
        req.body.PaymentDetailId
      ),
      PaymentModeTransactionDetailId: helper.updateFieldValue(
        findById,
        req.body.PaymentModeTransactionDetailId
      ),
      PaymentReceivedTypeId: helper.updateFieldValue(
        findById,
        req.body.PaymentReceivedTypeId
      ),
      UserId: helper.updateFieldValue(findById, req.body.UserId),
      Active: helper.updateFieldValue(findById, req.body.Active),
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await paymentbreakupmodel.update(updatedReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentbreakup.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await paymentbreakupmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentbreakup.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.paymentbreakup.notFound'),
      })
    }

    await paymentbreakupmodel.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentbreakup.internalServerError',
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
        message: i18n.__('messages.modules.paymentbreakup.queryParamMissing'),
      })
    }

    const resp = await paymentbreakupmodel.searchByParam(
      tenantId,
      username,
      params
    )

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.paymentbreakup.queryParamNotSupported'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentbreakup.internalServerError',
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
        translateResponse(await paymentbreakupmodel.getAll(tenantId, username))
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentbreakup.internalServerError',
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
      PaymentDetailId: resp.PaymentDetailId,
      PaymentModeTransactionDetailId: resp.PaymentModeTransactionDetailId,
      PaymentReceivedTypeId: resp.PaymentReceivedTypeId,
      UserId: resp.UserId,
      Timestamp: resp.Timestamp,
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

    let paymentdetail = {
      Id: resp.PaymentDetailId,
      AccountTypeBaseId: resp.PaymentDetailAccountTypeBaseId,
      TransactionDetailLogId: resp.PaymentDetailTransactionDetailLogId,
      DiscountAmount: resp.PaymentDetailDiscountAmount,
      RoundOff: resp.PaymentDetailRoundOff,
      TotalAmount: resp.PaymentDetailTotalAmount,
      TaxesAmount: resp.PaymentDetailTaxesAmount,
      GrossAmount: resp.PaymentDetailGrossAmount,
      UserId: resp.PaymentDetailUserId,
      Active: resp.PaymentDetailActive,
    }

    let paymentmodetransactiondetail = {
      Id: resp.PaymentModeTransactionDetailId,
      PaymentModeId: resp.PaymentModeTransactionDetailPaymentModeId,
      RefNo: resp.PaymentModeTransactionDetailRefNo,
      Comment: resp.PaymentModeTransactionDetailComment,
      CF1: resp.PaymentModeTransactionDetailCF1,
      CF2: resp.PaymentModeTransactionDetailCF2,
      CF3: resp.PaymentModeTransactionDetailCF3,
      CF4: resp.PaymentModeTransactionDetailCF4,
      Active: resp.PaymentModeTransactionDetailActive,
    }

    let paymentreceivedtype = {
      Id: resp.PaymentReceivedId,
      Type: resp.PaymentReceivedType,
      Active: resp.PaymentReceivedActive,
    }

    respObject.accounttypebase = accounttypebase
    respObject.paymentdetail = paymentdetail
    respObject.paymentmodetransactiondetail = paymentmodetransactiondetail
    respObject.paymentreceivedtype = paymentreceivedtype

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await paymentbreakupmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentbreakup.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.paymentbreakup.notFound'),
      })
    }

    res.send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentbreakup.internalServerError',
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
      PaymentDetailId: req.body.PaymentDetailId,
      PaymentModeTransactionDetailId: req.body.PaymentModeTransactionDetailId,
      PaymentReceivedTypeId: req.body.PaymentReceivedTypeId,
      UserId: req.body.UserId,
      Timestamp: new Date(),
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await paymentbreakupmodel.create(reqModel, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentbreakup.internalServerError',
      res
    )
  }
}
