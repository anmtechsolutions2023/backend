const taxTypes = require('../models/taxtype.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')
const commonControllerErrorHandler = require('../common/errorhandle.common')

exports.deleteTaxType = async (req, res) => {
  try {
    const { tenantId, username } = req

    const taxTypeFindById = await taxTypes.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxtypes.application.delete
    )

    if (taxTypeFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.taxtype.notFound'),
      })
    }

    await taxTypes.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxtype.internalServerError',
      res
    )
  }
}

exports.fetchAllTaxTypes = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(await taxTypes.getAll(tenantId, username))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxtype.internalServerError',
      res
    )
  }
}

exports.fetchTaxTypeById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const taxType = await taxTypes.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxtypes.application.fetchById
    )

    if (taxType === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.taxtype.notFound'),
      })
    }

    return res.statusCode(statusCodes.HTTP_STATUS_OK).send(taxType)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxtype.internalServerError',
      res
    )
  }
}

exports.updateTaxType = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    const taxTypeFindById = await taxTypes.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxtypes.application.fetchById
    )

    if (taxTypeFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.taxtype.notFound'),
      })
    }

    let tt = {
      Id: taxTypeFindById[0].Id,
      Name: helper.isEmpty(req.body.Name)
        ? taxTypeFindById[0].Name
        : req.body.Name,
      Value: helper.isEmpty(req.body.Value)
        ? taxTypeFindById[0].Value
        : req.body.Value,
      Active: helper.isEmpty(req.body.Active)
        ? taxTypeFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    // Update in database
    return res
      .status(await taxTypes.update(tt, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxtype.internalServerError',
      res
    )
  }
}

exports.createTaxType = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    // Create a taxtype
    let tt = {
      Name: req.body.Name,
      Value: req.body.Value,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const taxTypeResp = await taxTypes.create(tt, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(taxTypeResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxtype.internalServerError',
      res
    )
  }
}
