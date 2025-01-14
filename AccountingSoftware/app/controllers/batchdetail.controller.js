const batchdetailModel = require('../models/batchdetail.model')
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

    const findById = await batchdetailModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.batchdetail.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.batchdetail.notFound'),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      BatchNo: helper.isEmpty(req.body.BatchNo)
        ? findById[0].BatchNo
        : req.body.BatchNo,
      Barcode: helper.isEmpty(req.body.Barcode)
        ? findById[0].Barcode
        : req.body.Barcode,
      MfgDate: helper.isEmpty(req.body.MfgDate)
        ? findById[0].MfgDate
        : req.body.MfgDate,
      Expdate: helper.isEmpty(req.body.Expdate)
        ? findById[0].Expdate
        : req.body.Expdate,
      PurchaseDate: helper.isEmpty(req.body.PurchaseDate)
        ? findById[0].PurchaseDate
        : req.body.PurchaseDate,
      IsNonReturnable: helper.isEmpty(req.body.IsNonReturnable)
        ? findById[0].IsNonReturnable
        : req.body.IsNonReturnable,
      CostInfoId: helper.isEmpty(req.body.CostInfoId)
        ? findById[0].CostInfoId
        : req.body.CostInfoId,
      UOMId: helper.isEmpty(req.body.UOMId)
        ? findById[0].UOMId
        : req.body.UOMId,
      Quantity: helper.isEmpty(req.body.Quantity)
        ? findById[0].Quantity
        : req.body.Quantity,
      MapProviderLocationMapperId: helper.isEmpty(
        req.body.MapProviderLocationMapperId
      )
        ? findById[0].MapProviderLocationMapperId
        : req.body.MapProviderLocationMapperId,
      BranchDetailId: helper.isEmpty(req.body.BranchDetailId)
        ? findById[0].BranchDetailId
        : req.body.BranchDetailId,
      Active: helper.isEmpty(req.body.Active)
        ? findById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await batchdetailModel.update(updatedReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.batchdetail.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await batchdetailModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.batchdetail.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.batchdetail.notFound'),
      })
    }

    await batchdetailModel.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.batchdetail.internalServerError',
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
        message: i18n.__('messages.modules.contactdetail.queryParamMissing'),
      })
    }

    const resp = await batchdetailModel.searchByParam(
      tenantId,
      username,
      params
    )

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.modules.batchdetail.queryParamNotSupported'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.batchdetail.internalServerError',
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
        translateResponse(await batchdetailModel.getAll(tenantId, username))
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.batchdetail.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let respObject = {
      Id: resp.Id,
      BatchNo: resp.BatchNo,
      Barcode: resp.Barcode,
      MfgDate: resp.MfgDate,
      Expdate: resp.Expdate,
      PurchaseDate: resp.PurchaseDate,
      IsNonReturnable: resp.IsNonReturnable,
      CostInfoId: resp.CostInfoId,
      UOMId: resp.UOMId,
      Quantity: resp.Quantity,
      MapProviderLocationMapperId: resp.MapProviderLocationMapperId,
      BranchDetailId: resp.BranchDetailId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    const costinfo = {
      Id: resp.CostInfoId,
      Amount: resp.CostInfoAmount,
      TaxGroupId: resp.CostInfoTaxGroupId,
      IsTaxIncluded: resp.CostInfoIsTaxIncluded,
      Active: resp.CostInfoActive,
    }

    const uom = {
      Id: resp.UOMId,
      UnitName: resp.UOMUnitName,
      IsPrimary: resp.UOMIsPrimary,
      Active: resp.UOMActive,
    }

    const mapproviderlocationmapper = {
      Id: resp.MapProviderLocationMapperId,
      MapProviderId: resp.MapProviderLocationMapperMapProviderId,
      LocationDetailId: resp.MapProviderLocationMapperLocationDetailId,
      Active: resp.MapProviderLocationMapperActive,
    }

    const branchdetail = {
      Id: resp.BranchDetailId,
      OrganizationDetailId: resp.BranchDetailOrganizationDetailId,
      ContactDetailId: resp.BranchDetailContactDetailId,
      AddressDetailId: resp.BranchDetailAddressDetailId,
      TransactionTypeConfigId: resp.BranchDetailTransactionTypeConfigId,
      BranchName: resp.BranchDetailBranchName,
      TINNo: resp.BranchDetailTINNo,
      GSTIN: resp.BranchDetailGSTIN,
      PAN: resp.BranchDetailPAN,
      CF1: resp.BranchDetailCF1,
      CF2: resp.BranchDetailCF2,
      CF3: resp.BranchDetailCF3,
      CF4: resp.BranchDetailCF4,
      Active: resp.BranchDetailActive,
    }

    respObject.costinfo = costinfo
    respObject.uom = uom
    respObject.mapproviderlocationmapper = mapproviderlocationmapper
    respObject.branchdetail = branchdetail

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await batchdetailModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.batchdetail.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.batchdetail.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.batchdetail.internalServerError',
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
      Id: req.body.Id,
      BatchNo: req.body.BatchNo,
      Barcode: req.body.Barcode,
      MfgDate: req.body.MfgDate,
      Expdate: req.body.Expdate,
      PurchaseDate: req.body.PurchaseDate,
      IsNonReturnable: req.body.IsNonReturnable,
      CostInfoId: req.body.CostInfoId,
      UOMId: req.body.UOMId,
      Quantity: req.body.Quantity,
      MapProviderLocationMapperId: req.body.MapProviderLocationMapperId,
      BranchDetailId: req.body.BranchDetailId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await batchdetailModel.create(reqModel, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.batchdetail.internalServerError',
      res
    )
  }
}
