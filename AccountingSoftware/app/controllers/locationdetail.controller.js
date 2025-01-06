const locationDetail = require('../models/locationdetail.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')
const commonControllerErrorHandler = require('../common/errorhandle.common')

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    let locationDetailFindById = await locationDetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.locationdetail.application.delete
    )

    if (locationDetailFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.locationdetail.notFound'),
      })
    }

    await locationDetail.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.locationdetail.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(await locationDetail.getAll(tenantId, username))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.locationdetail.internalServerError',
      res
    )
  }
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const locationdetailResp = await locationDetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.locationdetail.application.fetchById
    )

    if (locationdetailResp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.locationdetail.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(locationdetailResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.locationdetail.internalServerError',
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

    const locationDetailFindById = await locationDetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.locationdetail.application.update
    )

    if (locationDetailFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.locationdetail.notFound'),
      })
    }

    const ldReq = {
      Id: locationDetailFindById[0].Id,
      Lat: helper.isEmpty(req.body.Lat)
        ? locationDetailFindById[0].Lat
        : req.body.Lat,
      Lng: helper.isEmpty(req.body.Lng)
        ? locationDetailFindById[0].Lng
        : req.body.Lng,

      CF1: helper.isEmpty(req.body.CF1)
        ? locationDetailFindById[0].CF1
        : req.body.CF1,
      CF2: helper.isEmpty(req.body.CF2)
        ? locationDetailFindById[0].CF2
        : req.body.CF2,
      CF3: helper.isEmpty(req.body.CF3)
        ? locationDetailFindById[0].CF3
        : req.body.CF3,
      CF4: helper.isEmpty(req.body.CF4)
        ? locationDetailFindById[0].CF4
        : req.body.CF4,
      Active: helper.isEmpty(req.body.Active)
        ? locationDetailFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    // update record in database
    return res
      .status(await locationDetail.update(ldReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.locationdetail.internalServerError',
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

    // Create a location detail
    let ld = {
      Lat: req.body.Lat,
      Lng: req.body.Lng,
      CF1: req.body.CF1,
      CF2: req.body.CF2,
      CF3: req.body.CF3,
      CF4: req.body.CF4,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const locationDetailResp = await locationDetail.create(ld, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(locationDetailResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.locationdetail.internalServerError',
      res
    )
  }
}
