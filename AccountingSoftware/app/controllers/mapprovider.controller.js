const mapProvider = require('../models/mapprovider.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')
const commonControllerErrorHandler = require('../common/errorhandle.common')

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    let mapProviderFindById = await mapProvider.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapprovider.application.delete
    )

    if (mapProviderFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.mapprovider.notFound'),
      })
    }

    await mapProvider.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapprovider.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(await mapProvider.getAll(tenantId, username))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapprovider.internalServerError',
      res
    )
  }
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const mapProviderResp = await mapProvider.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapprovider.application.fetchById
    )

    if (mapProviderResp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.mapprovider.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(mapProviderResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapprovider.internalServerError',
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

    const mapProviderFindById = await mapProvider.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapprovider.application.update
    )

    if (mapProviderFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.mapprovider.notFound'),
      })
    }

    const mpReq = {
      Id: mapProviderFindById[0].Id,
      ProviderName: helper.isEmpty(req.body.ProviderName)
        ? mapProviderFindById[0].ProviderName
        : req.body.ProviderName,
      Active: helper.isEmpty(req.body.Active)
        ? mapProviderFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    // Update record in database
    return res
      .status(await mapProvider.update(mpReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapprovider.internalServerError',
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

    // Create a Map Provider
    const tg = {
      ProviderName: req.body.ProviderName,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const mapProviderResp = await mapProvider.create(tg, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(mapProviderResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapprovider.internalServerError',
      res
    )
  }
}
