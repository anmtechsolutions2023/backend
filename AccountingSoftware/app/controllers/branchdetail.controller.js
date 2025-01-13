const branchDetailModel = require('../models/branchdetail.model')
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

    const findById = await branchDetailModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchdetail.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.branchdetail.notFound'),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      OrganizationDetailId: helper.isEmpty(req.body.OrganizationDetailId)
        ? findById[0].OrganizationDetailId
        : req.body.OrganizationDetailId,
      ContactDetailId: helper.isEmpty(req.body.ContactDetailId)
        ? findById[0].ContactDetailId
        : req.body.ContactDetailId,
      AddressDetailId: helper.isEmpty(req.body.AddressDetailId)
        ? findById[0].AddressDetailId
        : req.body.AddressDetailId,
      TransactionTypeConfigId: helper.isEmpty(req.body.TransactionTypeConfigId)
        ? findById[0].TransactionTypeConfigId
        : req.body.TransactionTypeConfigId,
      BranchName: helper.isEmpty(req.body.BranchName)
        ? findById[0].BranchName
        : req.body.BranchName,
      TINNo: helper.isEmpty(req.body.TINNo)
        ? findById[0].TINNo
        : req.body.TINNo,
      GSTIN: helper.isEmpty(req.body.GSTIN)
        ? findById[0].GSTIN
        : req.body.GSTIN,
      PAN: helper.isEmpty(req.body.PAN) ? findById[0].PAN : req.body.PAN,
      CF1: helper.isEmpty(req.body.CF1) ? findById[0].CF1 : req.body.CF1,
      CF2: helper.isEmpty(req.body.CF2) ? findById[0].CF2 : req.body.CF2,
      CF3: helper.isEmpty(req.body.CF3) ? findById[0].CF3 : req.body.CF3,
      CF4: helper.isEmpty(req.body.CF4) ? findById[0].CF4 : req.body.CF4,
      Active: helper.isEmpty(req.body.Active)
        ? findById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await branchDetailModel.update(updatedReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchdetail.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await branchDetailModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchdetail.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.branchdetail.notFound'),
      })
    }

    await branchDetailModel.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchdetail.internalServerError',
      res
    )
  }
}

exports.search = async (req, res) => {
  const { tenantId, username } = req

  const params = queryParams.getQueryParams(req.query)

  const queryParamName = params['QueryParamName']
  const queryParamValue = params['QueryParamValue']

  if (helper.isEmpty(queryParamName) || helper.isEmpty(queryParamValue)) {
    return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
      message: i18n.__('messages.modules.contactdetail.queryParamMissing'),
    })
  }

  const resp = await branchDetailModel.searchByParam(tenantId, username, params)

  if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
    return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
      message: i18n.__('messages.modules.contactdetail.queryParamNotSupported'),
    })
  }

  return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(
        translateResponse(await branchDetailModel.getAll(tenantId, username))
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchdetail.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let branchdetailObject = {
      Id: resp.Id,
      OrganizationDetailId: resp.OrganizationDetailId,
      ContactDetailId: resp.ContactDetailId,
      AddressDetailId: resp.AddressDetailId,
      TransactionTypeConfigId: resp.TransactionTypeConfigId,
      BranchName: resp.BranchName,
      TINNo: resp.TINNo,
      GSTIN: resp.GSTIN,
      PAN: resp.PAN,
      CF1: resp.CF1,
      CF2: resp.CF2,
      CF3: resp.CF3,
      CF4: resp.CF4,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let organizationdetail = {
      Id: resp.OrganizationDetailId,
      Name: resp.OrganizationDetailName,
      Active: resp.OrganizationDetailActive,
    }

    let contactdetail = {
      Id: resp.ContactDetailId,
      FirstName: resp.ContactDetailFirstName,
      LastName: resp.ContactDetailLastName,
      MobileNo: resp.ContactDetailMobileNo,
      AltMobileNo: resp.ContactDetailAltMobileNo,
      Landline1: resp.ContactDetailLandline1,
      Landline2: resp.ContactDetailLandline2,
      Ext1: resp.ContactDetailExt1,
      Ext2: resp.ContactDetailExt2,
      ContactAddressTypeId: resp.ContactDetailContactAddressTypeId,
      Active: resp.ContactDetailActive,
    }

    let addressdetail = {
      Id: resp.AddressDetailId,
      AddressLine1: resp.AddressDetailAddressLine1,
      AddressLine2: resp.AddressDetailAddressLine2,
      City: resp.AddressDetailCity,
      State: resp.AddressDetailState,
      Pincode: resp.AddressDetailPincode,
      MapProviderLocationMapperId:
        resp.AddressDetailMapProviderLocationMapperId,
      Landmark: resp.AddressDetailLandmark,
      ContactAddressTypeId: resp.AddressDetailContactAddressTypeId,
      Active: resp.AddressDetailActive,
    }

    let transactiontypeconfig = {
      Id: resp.TransactionTypeConfigId,
      StartCounterNo: resp.TransactionTypeConfigStartCounterNo,
      Prefix: resp.TransactionTypeConfigPrefix,
      Format: resp.TransactionTypeConfigFormat,
      Active: resp.TransactionTypeConfigActive,
    }

    branchdetailObject.organizationdetail = organizationdetail
    branchdetailObject.contactdetail = contactdetail
    branchdetailObject.addressdetail = addressdetail
    branchdetailObject.transactiontypeconfig = transactiontypeconfig

    respDetail.push(branchdetailObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await branchDetailModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchdetail.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.branchdetail.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchdetail.internalServerError',
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
      OrganizationDetailId: req.body.OrganizationDetailId,
      ContactDetailId: req.body.ContactDetailId,
      AddressDetailId: req.body.AddressDetailId,
      TransactionTypeConfigId: req.body.TransactionTypeConfigId,
      BranchName: req.body.BranchName,
      TINNo: req.body.TINNo,
      GSTIN: req.body.GSTIN,
      PAN: req.body.PAN,
      CF1: req.body.CF1,
      CF2: req.body.CF2,
      CF3: req.body.CF3,
      CF4: req.body.CF4,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await branchDetailModel.create(reqModel, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.branchdetail.internalServerError',
      res
    )
  }
}
