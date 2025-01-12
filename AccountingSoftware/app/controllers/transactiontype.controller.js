const transactiontype = require('../models/transactiontype.model')``
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
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

    const ttFindById = await transactiontype.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypes.application.update
    )

    if (ttFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactiontypes.notFound'),
      })
    }

    const updatedtt = {
      Id: ttFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? ttFindById[0].Name : req.body.Name,
      TransactionTypeConfigId: helper.isEmpty(req.body.TransactionTypeConfigId)
        ? ttFindById[0].TTCId
        : req.body.TransactionTypeConfigId,
      Active: helper.isEmpty(req.body.Active)
        ? ttFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await transactiontype.update(updatedtt, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypes.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const ttFindById = await transactiontype.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypes.application.delete
    )

    if (ttFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactiontypes.notFound'),
      })
    }

    await transactiontype.deleteById(req.params.id, tenantId, username)

    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypes.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(await transactiontype.getAll(tenantId, username)))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypes.internalServerError',
      res
    )
  }
}

function translateResponse(tt) {
  let ttDetail = []
  tt.map((t) => {
    let ttc = {
      Id: t.TTCId,
      StartCounterNo: t.TTCStartCounterNo,
      Prefix: t.TTCPrefix,
      Format: t.TTCFormat,
      Active: t.TTCActive,
      TenantId: t.TTCTenantId,
    }

    let transactiontype = {
      Id: t.Id,
      Name: t.Name,
      TransactionTypeConfigId: t.TTCId,
      Active: t.Active,
      TenantId: t.TenantId,
      TransactionTypeConfig: ttc,
    }

    ttDetail.push(transactiontype)
  })

  return ttDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const ttResp = await transactiontype.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypes.application.fetchById
    )

    if (ttResp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactiontypes.notFound'),
      })
    }

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(ttResp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypes.internalServerError',
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

    // Create a Transaction Type
    const ttDetail = {
      Name: req.body.Name,
      TransactionTypeConfigId: req.body.TransactionTypeConfigId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const ttResp = await transactiontype.create(ttDetail, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(ttResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypes.internalServerError',
      res
    )
  }
}
