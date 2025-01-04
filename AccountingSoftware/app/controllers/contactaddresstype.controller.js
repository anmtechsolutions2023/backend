const contactaddresstype = require('../models/contactaddresstype.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const handleDatabaseError = require('../common/errorhandle.common')
const i18n = require('../utils/i18n')

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    let catFindById = await contactaddresstype.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactaddresstype.application.delete
    )

    if (catFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.contactaddresstype.notFound'),
      })
    }

    await contactaddresstype.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__(
        'messages.modules.contactaddresstype.internalServerError'
      ),
    })
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res.send(await contactaddresstype.getAll(tenantId, username))
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__(
        'messages.modules.contactaddresstype.internalServerError'
      ),
    })
  }
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const catResp = await contactaddresstype.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactaddresstype.application.fetchById
    )

    if (catResp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.contactaddresstype.notFound'),
      })
    }

    return res.send(catResp)
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__(
        'messages.modules.contactaddresstype.internalServerError'
      ),
    })
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

    let catFindById = await contactaddresstype.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactaddresstype.application.update
    )

    if (catFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.contactaddresstype.notFound'),
      })
    }

    let cat = {
      Id: catFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? catFindById[0].Name : req.body.Name,
      Active: helper.isEmpty(req.body.Active)
        ? catFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await contactaddresstype.update(cat, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__(
        'messages.modules.contactaddresstype.internalServerError'
      ),
    })
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

    // Create a Contact Address Type
    let cat = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const catResp = await contactaddresstype.create(cat, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(catResp)
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__(
        'messages.modules.contactaddresstype.internalServerError'
      ),
    })
  }
}
