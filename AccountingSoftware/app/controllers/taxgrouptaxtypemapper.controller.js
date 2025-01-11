const taxgrouptaxtypemapper = require('../models/taxgrouptaxtypemapper.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const queryParams = require('../utils/queyParams')
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

    const tgttmFindById = await taxgrouptaxtypemapper.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.application.update
    )

    if (tgttmFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.taxgrouptaxtypemapper.notFound'),
      })
    }

    const updatedtgttm = {
      Id: tgttmFindById[0].Id,
      TaxGroupId: helper.isEmpty(req.body.TaxGroupId)
        ? tgttmFindById[0].TaxGroupId
        : req.body.TaxGroupId,
      TaxTypeId: helper.isEmpty(req.body.TaxTypeId)
        ? tgttmFindById[0].TaxTypeId
        : req.body.TaxTypeId,
      Active: helper.isEmpty(req.body.Active)
        ? tgttmFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    // Update record in database
    return res
      .status(await taxgrouptaxtypemapper.update(updatedtgttm, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgrouptaxtypemapper.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const tgtymFindById = await taxgrouptaxtypemapper.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.application.delete
    )

    if (tgtymFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.taxgrouptaxtypemapper.notFound'),
      })
    }

    await taxgrouptaxtypemapper.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgrouptaxtypemapper.internalServerError',
      res
    )
  }
}

exports.search = async (req, res) => {
  try {
    const { tenantId, username } = req

    const params = queryParams.getQueryParams(req.query)
    const queryParamName = params['QueryParamName']
    const queryParamValue = params['QueryParamValue']

    if (helper.isEmpty(queryParamName) || helper.isEmpty(queryParamValue)) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.taxgrouptaxtypemapper.queryParamMissing'
        ),
      })
    }

    const tgttmresp = await taxgrouptaxtypemapper.searchByParam(
      tenantId,
      username,
      params
    )

    if (tgttmresp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.taxgrouptaxtypemapper.queryParamNotSupported'
        ),
      })
    }

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(tgttmresp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgrouptaxtypemapper.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(
        translateResponse(
          await taxgrouptaxtypemapper.getAll(tenantId, username)
        )
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgrouptaxtypemapper.internalServerError',
      res
    )
  }
}

function translateResponse(tgttmresp) {
  let tgttmDetails = []
  tgttmresp.map((resp) => {
    let mapper = {
      Id: resp.Id,
      TaxGroupId: resp.TaxGroupId,
      TaxTypeId: resp.TaxTypeId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let taxgroup = {
      Id: resp.TaxGroupId,
      Name: resp.TaxGroupName,
      Active: resp.TaxGroupActive,
    }

    let taxtype = {
      Id: resp.TaxTypeId,
      Name: resp.TaxTypeName,
      Value: resp.TaxTypeValue,
      Active: resp.TaxTypeActive,
    }

    mapper.taxgroup = taxgroup
    mapper.taxtype = taxtype

    tgttmDetails.push(mapper)
  })
  return tgttmDetails
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const tgttmresp = await taxgrouptaxtypemapper.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.application.fetchById
    )

    if (tgttmresp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.taxgrouptaxtypemapper.notFound'),
      })
    }

    res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(tgttmresp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgrouptaxtypemapper.internalServerError',
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

    // Create a Tax Group Tax Type Mapper
    const tgttm = {
      TaxGroupId: req.body.TaxGroupId,
      TaxTypeId: req.body.TaxTypeId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const tgttmResp = await taxgrouptaxtypemapper.create(tgttm, username)

    return res.status(statusCodes.HTTP_STATUS_CREATED).send(tgttmResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.taxgrouptaxtypemapper.internalServerError',
      res
    )
  }
}
