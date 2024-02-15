const branchDetailModel = require('../models/branchdetail.model')
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
    let findById = await branchDetailModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchdetail.application.update
    )

    if (findById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedReq = {
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

    await branchDetailModel
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

  let findById = await branchDetailModel.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.branchdetail.application.delete
  )

  if (findById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  branchDetailModel
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

  branchDetailModel
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

  branchDetailModel
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

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  branchDetailModel
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchdetail.application.fetchById
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

    branchDetailModel
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
