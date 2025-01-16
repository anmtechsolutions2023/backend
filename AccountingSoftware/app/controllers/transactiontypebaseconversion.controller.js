const transactiontypebaseconversionmodel = require('../models/transactiontypebaseconversion.model')
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

    const findById = await transactiontypebaseconversionmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypebaseconversion.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__(
          'messages.modules.transactiontypebaseconversion.notFound'
        ),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      FromTransactionTypeId: helper.isEmpty(req.body.FromTransactionTypeId)
        ? findById[0].FromTransactionTypeId
        : req.body.FromTransactionTypeId,
      ToTransactionTypeId: helper.isEmpty(req.body.ToTransactionTypeId)
        ? findById[0].ToTransactionTypeId
        : req.body.ToTransactionTypeId,
      Active: helper.isEmpty(req.body.Active)
        ? findById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(
        await transactiontypebaseconversionmodel.update(updatedReq, username)
      )
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypebaseconversion.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await transactiontypebaseconversionmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypebaseconversion.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__(
          'messages.modules.transactiontypebaseconversion.notFound'
        ),
      })
    }

    await transactiontypebaseconversionmodel.deleteById(
      req.params.id,
      tenantId,
      username
    )
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypebaseconversion.internalServerError',
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

    const resp = await transactiontypebaseconversionmodel.searchByParam(
      tenantId,
      username,
      params
    )

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.transactiontypebaseconversion.queryParamNotSupported'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypebaseconversion.internalServerError',
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
          await transactiontypebaseconversionmodel.getAll(tenantId, username)
        )
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypebaseconversion.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let respObject = {
      Id: resp.Id,
      FromTransactionTypeId: resp.FromTransactionTypeId,
      ToTransactionTypeId: resp.ToTransactionTypeId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let fromTransationTypeObject = {
      Id: resp.FromTransactionTypeId,
      Name: resp.FromTransactionTypeName,
      TransactionTypeConfigId: resp.FromTransactionTypeTransactionTypeConfigId,
      Active: resp.FromTransactionTypeActive,
    }

    let toTransationTypeObject = {
      Id: resp.ToTransactionTypeId,
      Name: resp.ToTransactionTypeName,
      TransactionTypeConfigId: resp.ToTransactionTypeTransactionTypeConfigId,
      Active: resp.ToTransactionTypeActive,
    }

    respObject.fromTransationTypeObject = fromTransationTypeObject
    respObject.toTransationTypeObject = toTransationTypeObject

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await transactiontypebaseconversionmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypebaseconversion.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__(
          'messages.modules.transactiontypebaseconversion.notFound'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypebaseconversion.internalServerError',
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
      FromTransactionTypeId: req.body.FromTransactionTypeId,
      ToTransactionTypeId: req.body.ToTransactionTypeId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await transactiontypebaseconversionmodel.create(
      reqModel,
      username
    )

    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypebaseconversion.internalServerError',
      res
    )
  }
}
