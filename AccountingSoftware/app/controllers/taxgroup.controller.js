const taxGroup = require('../models/taxgroup.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')
const commonControllerErrorHandler = require('../common/errorhandle.common')

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const taxGroupFindById = await taxGroup.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgroup.application.delete
    )

    if (taxGroupFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.taxgroup.notFound'),
      })
    }

    await taxGroup.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgroup.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res.send(await taxGroup.getAll(tenantId, username))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgroup.internalServerError',
      res
    )
  }
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const taxGroupResp = await taxGroup.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgroup.application.fetchById
    )

    if (taxGroupResp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.taxgroup.notFound'),
      })
    }

    return res.send(taxGroupResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgroup.internalServerError',
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

    const taxGroupFindById = await taxGroup.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgroup.application.update
    )

    if (taxGroupFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.taxgroup.notFound'),
      })
    }

    let tg = {
      Id: taxGroupFindById[0].Id,
      Name: helper.isEmpty(req.body.Name)
        ? taxGroupFindById[0].Name
        : req.body.Name,
      Value: helper.isEmpty(req.body.Value)
        ? taxGroupFindById[0].Value
        : req.body.Value,
      Active: helper.isEmpty(req.body.Active)
        ? taxGroupFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await taxGroup.update(tg, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgroup.internalServerError',
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

    // Create a tax group
    let tg = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const taxGroupResp = await taxGroup.create(tg, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(taxGroupResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgroup.internalServerError',
      res
    )
  }
}
