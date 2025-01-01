const uomfactor = require('../models/uomfactor.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const handleDatabaseError = require('../common/errorhandle.common')
const i18n = require('../utils/i18n')

exports.update = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    // Find UOM factor by Id
    let uomfFindById = await uomfactor.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.uomfactor.application.update
    )

    if (uomfFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.uomfactor.notFound'),
      })
    }

    let updateuomf = {
      Id: uomfFindById[0].Id,
      PrimaryUOMId: helper.isEmpty(req.body.PrimaryUOMId)
        ? uomfFindById[0].PrimaryUOMId
        : req.body.PrimaryUOMId,
      SecondaryUOMId: helper.isEmpty(req.body.SecondaryUOMId)
        ? uomfFindById[0].SecondaryUOMId
        : req.body.SecondaryUOMId,
      Factor: helper.isEmpty(req.body.Factor)
        ? uomfFindById[0].Factor
        : req.body.Factor,
      Active: helper.isEmpty(req.body.Active)
        ? uomfFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await uomfactor.update(updateuomf, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__('messages.modules.uomfactor.internalServerError'),
    })
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    let uomfFindById = await uomfactor.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.uomfactor.application.delete
    )

    if (uomfFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.uomfactor.notFound'),
      })
    }

    await uomfactor.delete(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__('messages.modules.uomfactor.internalServerError'),
    })
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req
    const uomf = await uomfactor.getAll(tenantId, username)

    let uomfDetail = []
    uomf.map((uf) => {
      let primaryuom = {
        PrimaryUOMId: uf.PrimaryUOMId,
        PrimaryUOMName: uf.PrimaryUnitName,
        PrimaryUOMActive: uf.PrimaryUnitNameActive,
      }

      let secondaryuom = {
        SecondaryUOMId: uf.SecondaryUOMId,
        SecondaryUOMName: uf.SecondayUnitName,
        SecondaryUOMActive: uf.SecondayUnitActive,
      }

      let uomf = {
        Id: uf.Id,
        Factor: uf.Factor,
        TenantId: uf.TenantId,
        Active: uf.Active,
        PrimaryUOM: primaryuom,
        SecondayUOM: secondaryuom,
      }

      uomfDetail.push(uomf)
    })

    return res.status(statusCodes.HTTP_STATUS_OK).send(uomfDetail)
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__('messages.modules.uomfactor.internalServerError'),
    })
  }
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const uomf = await uomfactor.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.uomfactor.application.fetchById
    )

    if (uomf === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.uomfactor.notFound'),
      })
    }

    let uomfDetail = []
    uomf.map((uf) => {
      let primaryuom = {
        PrimaryUOMId: uf.PrimaryUOMId,
        PrimaryUOMName: uf.PrimaryUnitName,
        PrimaryUOMActive: uf.PrimaryUnitNameActive,
      }

      let secondaryuom = {
        SecondaryUOMId: uf.SecondaryUOMId,
        SecondaryUOMName: uf.SecondayUnitName,
        SecondaryUOMActive: uf.SecondayUnitActive,
      }

      let uomf = {
        Id: uf.Id,
        Factor: uf.Factor,
        TenantId: uf.TenantId,
        Active: uf.Active,
        PrimaryUOM: primaryuom,
        SecondayUOM: secondaryuom,
      }

      uomfDetail.push(uomf)
    })

    return res.status(statusCodes.HTTP_STATUS_OK).send(uomfDetail)
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__('messages.modules.uomfactor.internalServerError'),
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

    // Create a UOM Factor
    let uomf = {
      PrimaryUOMId: req.body.PrimaryUOMId,
      SecondaryUOMId: req.body.SecondaryUOMId,
      Factor: req.body.Factor,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const createdUOMFactor = await uomfactor.create(uomf, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(createdUOMFactor)
  } catch (err) {
    if (err instanceof handleDatabaseError.DatabaseError) {
      return res.status(err.statusCode).send({
        message: err.message,
      })
    }

    return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: i18n.__('messages.modules.uomfactor.internalServerError'),
    })
  }
}
