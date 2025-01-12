const transactiontypeconfig = require('../models/transactiontypeconfig.model')
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

    const ttcFindById = await transactiontypeconfig.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypeconfig.application.update
    )

    if (ttcFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactiontypeconfig.notFound'),
      })
    }

    const updatedttc = {
      Id: ttcFindById[0].Id,
      StartCounterNo: helper.isEmpty(req.body.StartCounterNo)
        ? ttcFindById[0].StartCounterNo
        : req.body.StartCounterNo,
      Prefix: helper.isEmpty(req.body.Prefix)
        ? ttcFindById[0].Prefix
        : req.body.Prefix,
      Format: helper.isEmpty(req.body.Format)
        ? ttcFindById[0].Format
        : req.body.Format,
      Active: helper.isEmpty(req.body.Active)
        ? ttcFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await transactiontypeconfig.update(updatedttc, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconfig.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const ttcFindById = await transactiontypeconfig.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypeconfig.application.delete
    )

    if (ttcFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactiontypeconfig.notFound'),
      })
    }

    await transactiontypeconfig.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconfig.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(await transactiontypeconfig.getAll(tenantId, username))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconfig.internalServerError',
      res
    )
  }
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const cd = await transactiontypeconfig.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypeconfig.application.fetchById
    )

    if (cd === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactiontypeconfig.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(cd)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconfig.internalServerError',
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

    // Create a Transaction Type Config
    const ttc = {
      StartCounterNo: req.body.StartCounterNo,
      Prefix: req.body.Prefix,
      Format: req.body.Format,
      Active: req.body.Active,
      TenantId: req.body.TenantId,
      CreatedOn: new Date(),
      CreatedBy: tenantId,
    }

    const ttcResp = await transactiontypeconfig.create(ttc, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(ttcResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiontypeconfig.internalServerError',
      res
    )
  }
}
