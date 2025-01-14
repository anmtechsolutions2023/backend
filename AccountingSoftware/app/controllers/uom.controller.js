const uom = require('../models/uom.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')
const commonControllerErrorHandler = require('../common/errorhandle.common')

exports.updateUOM = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    // Find UOM by Id
    const uomFindById = await uom.findById(req.params.id, tenantId, username)

    if (uomFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.uom.notFound'),
      })
    }

    const updatedUOM = {
      Id: uomFindById[0].Id,
      UnitName: helper.isEmpty(req.body.UnitName)
        ? uomFindById[0].UnitName
        : req.body.UnitName,
      IsPrimary: helper.isEmpty(req.body.IsPrimary)
        ? uomFindById[0].IsPrimary
        : req.body.IsPrimary,
      Active: helper.isEmpty(req.body.Active)
        ? uomFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    // Update UOM in database
    return res
      .status(await uom.update(updatedUOM, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.uom.internalServerError',
      res
    )
  }
}

exports.deleteUOM = async (req, res) => {
  try {
    const { tenantId, username } = req

    const uomFindById = await uom.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.uom.application.delete
    )

    if (uomFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.uom.notFound'),
      })
    }

    await uom.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.uom.internalServerError',
      res
    )
  }
}

exports.fetchAllUOMs = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(await uom.getAll(tenantId, username))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.uom.internalServerError',
      res
    )
  }
}

exports.fetchUOMById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const uomData = await uom.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.uom.application.fetchById
    )

    if (uomData === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.uom.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(uomData)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.uom.internalServerError',
      res
    )
  }
}

exports.createUOM = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    // Create a UOM
    const um = {
      UnitName: req.body.UnitName,
      IsPrimary: req.body.IsPrimary,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const createdUOM = await uom.create(um, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(createdUOM)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.uom.internalServerError',
      res
    )
  }
}
