const itemdetailmodel = require('../models/itemdetail.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const decodeToken = require('../utils/extracttoken')
const queryParams = require('../utils/queyParams')

exports.update = async (req, res) => {
  console.log('Inside update')
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    let findById = await itemdetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.itemdetail.application.update
    )

    if (findById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedReq = {
      Id: findById[0].Id,
      Type: helper.isEmpty(req.body.Type) ? findById[0].Type : req.body.Type,
      HSNCode: helper.isEmpty(req.body.HSNCode)
        ? findById[0].HSNCode
        : req.body.HSNCode,
      SKU: helper.isEmpty(req.body.SKU) ? findById[0].SKU : req.body.SKU,
      BatchDetailId: helper.isEmpty(req.body.BatchDetailId)
        ? findById[0].BatchDetailId
        : req.body.BatchDetailId,
      CategoryId: helper.isEmpty(req.body.CategoryId)
        ? findById[0].CategoryId
        : req.body.CategoryId,
      Description: helper.isEmpty(req.body.Description)
        ? findById[0].Description
        : req.body.Description,
      Active: helper.isEmpty(req.body.Active)
        ? findById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await itemdetailmodel
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

  let findById = await itemdetailmodel.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.itemdetail.application.delete
  )

  if (findById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  itemdetailmodel
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

  itemdetailmodel
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

  itemdetailmodel
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
      Type: resp.Type,
      HSNCode: resp.HSNCode,
      SKU: resp.SKU,
      BatchDetailId: resp.BatchDetailId,
      CategoryId: resp.CategoryId,
      Description: resp.Description,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let batchdetailObject = {
      Id: resp.BatchDetailId,
      BatchNo: resp.BatchDetailBatchNo,
      Barcode: resp.BatchDetailBarcode,
      MfgDate: resp.BatchDetailMfgDate,
      Expdate: resp.BatchDetailExpdate,
      PurchaseDate: resp.BatchDetailPurchaseDate,
      IsNonReturnable: resp.BatchDetailIsNonReturnable,
      CostInfoId: resp.BatchDetailCostInfoId,
      UOMId: resp.BatchDetailUOMId,
      Quantity: resp.BatchDetailQuantity,
      MapProviderLocationMapperId: resp.BatchDetailMapProviderLocationMapperId,
      BranchDetailId: resp.BatchDetailBranchDetailId,
      Active: resp.BranchDetailActive,
    }

    let categorydetail = {
      Id: resp.CategoryDetailId,
      Name: resp.CategoryDetailName,
      Active: resp.CategoryDetailActive,
    }

    respObject.batchdetailObject = batchdetailObject
    respObject.categorydetail = categorydetail

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  itemdetailmodel
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.itemdetail.application.fetchById
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
      Type: req.body.Type,
      HSNCode: req.body.HSNCode,
      SKU: req.body.SKU,
      BatchDetailId: req.body.BatchDetailId,
      CategoryId: req.body.CategoryId,
      Description: req.body.Description,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    itemdetailmodel
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
