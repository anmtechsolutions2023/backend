const accounttypebase = require('../models/accounttypebase.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')
const commonControllerErrorHandler = require('../common/errorhandle.common')

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const atbFindById = await accounttypebase.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.accounttypebase.application.delete
    )

    if (atbFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.accounttypebase.notFound'),
      })
    }

    await accounttypebase.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.accounttypebase.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(await accounttypebase.getAll(tenantId, username))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.accounttypebase.internalServerError',
      res
    )
  }
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const atbResp = await accounttypebase.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.accounttypebase.application.fetchById
    )

    if (atbResp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.accounttypebase.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(atbResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.accounttypebase.internalServerError',
      res
    )
  }
}

exports.update = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    const atbFindById = await accounttypebase.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.accounttypebase.application.update
    )

    if (atbFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.accounttypebase.notFound'),
      })
    }

    const atb = {
      Id: atbFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? atbFindById[0].Name : req.body.Name,
      Active: helper.isEmpty(req.body.Active)
        ? atbFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await accounttypebase.update(atb, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.accounttypebase.internalServerError',
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

    // Create a Account Type Base
    const atb = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const atbResp = await accounttypebase.create(atb, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(atbResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.accounttypebase.internalServerError',
      res
    )
  }
}
