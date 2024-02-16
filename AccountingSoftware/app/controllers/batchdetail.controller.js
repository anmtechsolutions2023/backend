const batchdetailModel = require('../models/batchdetail.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const decodeToken = require('../utils/extracttoken')
const queryParams = require('../utils/queyParams')

exports.update = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    let findById = await batchdetailModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.batchdetail.application.update
    )

    if (findById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedReq = {
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

    await batchdetailModel
      .update(updatedReq, username)
      .then(() => {
        return res.status(200).send()
      })
      .catch((err) => {
        return res.status(500).send()
      })
  }
}

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let findById = await batchdetailModel.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.batchdetail.application.delete
  )

  if (findById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  batchdetailModel
    .delete(req.params.id, tenantId, username)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.search = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  var params = queryParams.getQueryParams(req.query)

  var queryParamName = params['QueryParamName']
  var queryParamValue = params['QueryParamValue']

  if (helper.isEmpty(queryParamName) || helper.isEmpty(queryParamValue)) {
    return res.status(400).send({
      message: 'query param not supported!',
    })
  }

  batchdetailModel
    .searchByParam(tenantId, username, params)
    .then((resp) => {
      res.status(200).send(translateResponse(resp))
    })
    .catch((errCode) => {
      if (errCode === 400) {
        return res.status(400).send({
          message: 'query param not supported!',
        })
      }
      res.sendStatus(500).send()
    })
}

exports.fetchAll = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  batchdetailModel
    .getAll(tenantId, username)
    .then((resp) => {
      res.status(200).send(translateResponse(resp))
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
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

    let costinfo = {
      Id: resp.CostInfoId,
      Amount: resp.CostInfoAmount,
      TaxGroupId: resp.CostInfoTaxGroupId,
      IsTaxIncluded: resp.CostInfoIsTaxIncluded,
      Active: resp.CostInfoActive,
    }

    let uom = {
      Id: resp.UOMId,
      UnitName: resp.UOMUnitName,
      IsPrimary: resp.UOMIsPrimary,
      Active: resp.UOMActive,
    }

    let mapproviderlocationmapper = {
      Id: resp.MapProviderLocationMapperId,
      MapProviderId: resp.MapProviderLocationMapperMapProviderId,
      LocationDetailId: resp.MapProviderLocationMapperLocationDetailId,
      Active: resp.MapProviderLocationMapperActive,
    }

    let branchdetail = {
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

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  batchdetailModel
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.batchdetail.application.fetchById
    )
    .then((resp) => {
      if (resp === 404) {
        return res.status(404).send({
          message: 'Record not found.',
        })
      }

      res.send(translateResponse(resp))
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.create = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    // Create a Record
    let reqModel = {
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

    batchdetailModel
      .create(reqModel, username)
      .then((resp) => {
        res.send(resp)
      })
      .catch((err) => {
        switch (err) {
          case 'ER_DUP_ENTRY': {
            return res.sendStatus(409).send()
          }
        }
        res.sendStatus(500).send()
      })
  }
}
