const categorydetail = require('../models/categorydetail.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')
const commonControllerErrorHandler = require('../common/errorhandle.common')

exports.updateCategoryDetail = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    const cdFindById = await categorydetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.categorydetail.application.update
    )

    if (cdFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.categorydetail.notFound'),
      })
    }

    const updatedCategoryDetail = {
      Id: cdFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? cdFindById[0].Name : req.body.Name,
      Active: helper.isEmpty(req.body.Active)
        ? cdFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    // Update record in database
    return res
      .status(await categorydetail.update(updatedCategoryDetail, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.categorydetail.internalServerError',
      res
    )
  }
}

exports.deleteCategoryDetail = async (req, res) => {
  try {
    const { tenantId, username } = req

    const cdFindById = await categorydetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.categorydetail.application.delete
    )

    if (cdFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.categorydetail.notFound'),
      })
    }

    await categorydetail.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.categorydetail.internalServerError',
      res
    )
  }
}

exports.fetchAllCategoryDetails = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(await categorydetail.getAll(tenantId, username))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.categorydetail.internalServerError',
      res
    )
  }
}

exports.fetchCategoryDetailById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const cd = await categorydetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.categorydetail.application.fetchById
    )

    if (cd === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.categorydetail.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(cd)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.categorydetail.internalServerError',
      res
    )
  }
}

exports.createCategoryDetail = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    // Create a Category Detail
    const cd = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const cdResp = await categorydetail.create(cd, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(cdResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.categorydetail.internalServerError',
      res
    )
  }
}
