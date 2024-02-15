const branchusergroupmapperModel = require('../models/branchusergroupmapper.model')
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
    let findById = await branchusergroupmapperModel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchusergroupmapper.application.update
    )

    if (findById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedReq = {
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

    await branchusergroupmapperModel
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

  let findById = await branchusergroupmapperModel.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.branchusergroupmapper.application.delete
  )

  if (findById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  branchusergroupmapperModel
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

  branchusergroupmapperModel
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

  branchusergroupmapperModel
    .getAll(tenantId, username)
    .then((resp) => {
      //   res.status(200).send(resp)
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

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  branchusergroupmapperModel
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.branchusergroupmapper.application.fetchById
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
      BranchDetailId: req.body.BranchDetailId,
      UserGroupId: req.body.UserGroupId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    branchusergroupmapperModel
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
