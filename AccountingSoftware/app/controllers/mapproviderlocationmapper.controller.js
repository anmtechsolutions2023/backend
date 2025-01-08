const mapproviderlocationmapper = require('../models/mapproviderlocationmapper.model')
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

    const mplmFindById = await mapproviderlocationmapper.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapproviderlocationmapper.application.update
    )

    if (mplmFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.mapproviderlocationmapper.notFound'),
      })
    }

    const updatedmplm = {
      Id: mplmFindById[0].Id,
      MapProviderId: helper.isEmpty(req.body.MapProviderId)
        ? mplmFindById[0].MapProviderId
        : req.body.MapProviderId,
      LocationDetailId: helper.isEmpty(req.body.LocationDetailId)
        ? mplmFindById[0].LocationDetailId
        : req.body.LocationDetailId,
      Active: helper.isEmpty(req.body.Active)
        ? mplmFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    // Update record in database
    return res
      .status(await mapproviderlocationmapper.update(updatedmplm, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapproviderlocationmapper.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const respFindById = await mapproviderlocationmapper.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapproviderlocationmapper.application.delete
    )

    if (respFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.mapproviderlocationmapper.notFound'),
      })
    }

    await mapproviderlocationmapper.deleteById(
      req.params.id,
      tenantId,
      username
    )

    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapproviderlocationmapper.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(await mapproviderlocationmapper.getAll(tenantId, username))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapproviderlocationmapper.internalServerError',
      res
    )
  }
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const mplmResp = await mapproviderlocationmapper.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapproviderlocationmapper.application.fetchById
    )

    if (mplmResp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.mapproviderlocationmapper.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(mplmResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapproviderlocationmapper.internalServerError',
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

    // Create a record
    let mplm = {
      MapProviderId: req.body.MapProviderId,
      LocationDetailId: req.body.LocationDetailId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const mplmResp = await mapproviderlocationmapper.create(mplm, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(mplmResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.mapproviderlocationmapper.internalServerError',
      res
    )
  }
}
