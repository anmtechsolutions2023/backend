const costinfo = require('../models/costinfo.model')
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

    const findById = await costinfo.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.costinfo.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.costinfo.notFound'),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      Amount: helper.isEmpty(req.body.Amount)
        ? findById[0].Amount
        : req.body.Amount,
      TaxGroupId: helper.isEmpty(req.body.TaxGroupId)
        ? findById[0].TaxGroupId
        : req.body.TaxGroupId,
      IsTaxIncluded: helper.isEmpty(req.body.IsTaxIncluded)
        ? findById[0].IsTaxIncluded
        : req.body.IsTaxIncluded,
      Active: helper.isEmpty(req.body.Active)
        ? findById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    // Update record in database
    return res
      .status(await costinfo.update(updatedReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.costinfo.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    let findById = await costinfo.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.costinfo.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.costinfo.notFound'),
      })
    }

    await costinfo.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.costinfo.internalServerError',
      res
    )
  }
}

exports.search = async (req, res) => {
  try {
    const { tenantId, username } = req

    var params = queryParams.getQueryParams(req.query)

    var queryParamName = params['QueryParamName']
    var queryParamValue = params['QueryParamValue']

    if (helper.isEmpty(queryParamName) || helper.isEmpty(queryParamValue)) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.modules.costinfo.queryParamMissing'),
      })
    }

    const resp = await costinfo.searchByParam(tenantId, username, params)

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.modules.costinfo.queryParamNotSupported'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.costinfo.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(await costinfo.getAll(tenantId, username)))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.costinfo.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let costinfo = {
      Id: resp.Id,
      Amount: resp.Amount,
      TaxGroupId: resp.TaxGroupId,
      IsTaxIncluded: resp.IsTaxIncluded,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let taxgroup = {
      Id: resp.TaxGroupId,
      Name: resp.TaxGroupName,
      Active: resp.TaxGroupActive,
    }

    costinfo.taxgroup = taxgroup

    respDetail.push(costinfo)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await costinfo.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.costinfo.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.costinfo.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.costinfo.internalServerError',
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
    const ciReq = {
      Amount: req.body.Amount,
      TaxGroupId: req.body.TaxGroupId,
      IsTaxIncluded: req.body.IsTaxIncluded,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await costinfo.create(ciReq, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.costinfo.internalServerError',
      res
    )
  }
}
