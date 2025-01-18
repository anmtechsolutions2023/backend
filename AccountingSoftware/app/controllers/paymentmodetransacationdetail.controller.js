const paymentmodetransactiondetailmodel = require('../models/paymentmodetransacationdetail.model')
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

    const findById = await paymentmodetransactiondetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentmodetransactiondetail.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__(
          'messages.modules.paymentmodetransactiondetail.notFound'
        ),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      PaymentModeId: helper.updateFieldValue(findById, req.body.PaymentModeId),
      RefNo: helper.updateFieldValue(findById, req.body.RefNo),
      Comment: helper.updateFieldValue(findById, req.body.Comment),
      CF1: helper.updateFieldValue(findById, req.body.CF1),
      CF2: helper.updateFieldValue(findById, req.body.CF2),
      CF3: helper.updateFieldValue(findById, req.body.CF3),
      CF4: helper.updateFieldValue(findById, req.body.CF4),
      Active: helper.updateFieldValue(findById, req.body.Active),
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(
        await paymentmodetransactiondetailmodel.update(updatedReq, username)
      )
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentmodetransactiondetail.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await paymentmodetransactiondetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentmodetransactiondetail.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__(
          'messages.modules.paymentmodetransactiondetail.notFound'
        ),
      })
    }

    await paymentmodetransactiondetailmodel.deleteById(
      req.params.id,
      tenantId,
      username
    )

    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentmodetransactiondetail.internalServerError',
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
          'messages.modules.paymentmodetransactiondetail.queryParamMissing'
        ),
      })
    }

    const resp = await paymentmodetransactiondetailmodel.searchByParam(
      tenantId,
      username,
      params
    )

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.paymentmodetransactiondetail.queryParamNotSupported'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentmodetransactiondetail.internalServerError',
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
          await paymentmodetransactiondetailmodel.getAll(tenantId, username)
        )
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentmodetransactiondetail.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let respObject = {
      Id: resp.Id,
      PaymentModeId: resp.PaymentModeId,
      RefNo: resp.RefNo,
      Comment: resp.Comment,
      CF1: resp.CF1,
      CF2: resp.CF2,
      CF3: resp.CF3,
      CF4: resp.CF4,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let paymentmode = {
      Id: resp.PaymentModeId,
      Type: resp.PaymentModeType,
      Active: resp.PaymentModeActive,
    }

    respObject.paymentmode = paymentmode

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await paymentmodetransactiondetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentmodetransactiondetail.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__(
          'messages.modules.paymentmodetransactiondetail.notFound'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentmodetransactiondetail.internalServerError',
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
      PaymentModeId: req.body.PaymentModeId,
      RefNo: req.body.RefNo,
      Comment: req.body.Comment,
      CF1: req.body.CF1,
      CF2: req.body.CF2,
      CF3: req.body.CF3,
      CF4: req.body.CF4,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await paymentmodetransactiondetailmodel.create(
      reqModel,
      username
    )

    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.paymentmodetransactiondetail.internalServerError',
      res
    )
  }
}
