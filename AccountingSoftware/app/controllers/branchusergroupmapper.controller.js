const branchusergroupmapperModel = require('../models/branchusergroupmapper.model')
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

    const findById = await branchusergroupmapperModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchusergroupmapper.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.branchusergroupmapper.notFound'),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      BranchDetailId: helper.isEmpty(req.body.BranchDetailId)
        ? findById[0].BranchDetailId
        : req.body.BranchDetailId,
      UserGroupId: helper.isEmpty(req.body.UserGroupId)
        ? findById[0].UserGroupId
        : req.body.UserGroupId,
      Active: helper.isEmpty(req.body.Active)
        ? findById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await branchusergroupmapperModel.update(updatedReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchusergroupmapper.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await branchusergroupmapperModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchusergroupmapper.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.branchusergroupmapper.notFound'),
      })
    }

    await branchusergroupmapperModel.deleteById(
      req.params.id,
      tenantId,
      username
    )

    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchusergroupmapper.internalServerError',
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
          'messages.modules.branchusergroupmapper.queryParamMissing'
        ),
      })
    }

    const resp = await branchusergroupmapperModel.searchByParam(
      tenantId,
      username,
      params
    )

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.branchusergroupmapper.queryParamNotSupported'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchusergroupmapper.internalServerError',
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
          await branchusergroupmapperModel.getAll(tenantId, username)
        )
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchusergroupmapper.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let respObject = {
      Id: resp.Id,
      BranchDetailId: resp.BranchDetailId,
      UserGroupId: resp.UserGroupId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let branchdetailObject = {
      Id: resp.BranchDetailId,
      OrganizationDetailId: resp.BranchDetailOrganizationDetailId,
      ContactDetailId: resp.BranchDetailContactDetailId,
      AddressDetailId: resp.BranchDetailAddressDetailId,
      TransactionTypeConfigId: resp.BranchDetailTransactionTypeConfigId,
      BranchName: resp.BranchDetailBranchName,
      TINNo: resp.BranchDetailTINNo,
      GSTIN: resp.BrnachDetailGSTIN,
      PAN: resp.BranchDetailPAN,
      CF1: resp.BranchDetailCF1,
      CF2: resp.BranchDetailCF2,
      CF3: resp.BranchDetailCF3,
      CF4: resp.BranchDetailCF4,
      Active: resp.BranchDetailActive,
    }

    respObject.branchdetail = branchdetailObject

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await branchusergroupmapperModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchusergroupmapper.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.branchusergroupmapper.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchusergroupmapper.internalServerError',
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

    // Create a Record
    const reqModel = {
      BranchDetailId: req.body.BranchDetailId,
      UserGroupId: req.body.UserGroupId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await branchusergroupmapperModel.create(reqModel, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchusergroupmapper.internalServerError',
      res
    )
  }
}
