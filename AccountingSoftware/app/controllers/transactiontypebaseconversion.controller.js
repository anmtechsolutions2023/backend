const transactiontypebaseconversionmodel = require('../models/transactiontypebaseconversion.model')
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
    let findById = await transactiontypebaseconversionmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypebaseconversion.application.update
    )

    if (findById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedReq = {
      Id: findById[0].Id,
      FromTransactionTypeId: helper.isEmpty(req.body.FromTransactionTypeId)
        ? findById[0].FromTransactionTypeId
        : req.body.FromTransactionTypeId,
      ToTransactionTypeId: helper.isEmpty(req.body.ToTransactionTypeId)
        ? findById[0].ToTransactionTypeId
        : req.body.ToTransactionTypeId,
      Active: helper.isEmpty(req.body.Active)
        ? findById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await transactiontypebaseconversionmodel
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

  let findById = await transactiontypebaseconversionmodel.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.transactiontypebaseconversion.application.delete
  )

  if (findById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  transactiontypebaseconversionmodel
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

  transactiontypebaseconversionmodel
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

  transactiontypebaseconversionmodel
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
      FromTransactionTypeId: resp.FromTransactionTypeId,
      ToTransactionTypeId: resp.ToTransactionTypeId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let fromTransationTypeObject = {
      Id: resp.FromTransactionTypeId,
      Name: resp.FromTransactionTypeName,
      TransactionTypeConfigId: resp.FromTransactionTypeTransactionTypeConfigId,
      Active: resp.FromTransactionTypeActive,
    }

    let toTransationTypeObject = {
      Id: resp.ToTransactionTypeId,
      Name: resp.ToTransactionTypeName,
      TransactionTypeConfigId: resp.ToTransactionTypeTransactionTypeConfigId,
      Active: resp.ToTransactionTypeActive,
    }

    respObject.fromTransationTypeObject = fromTransationTypeObject
    respObject.toTransationTypeObject = toTransationTypeObject

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  transactiontypebaseconversionmodel
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypebaseconversion.application.fetchById
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
      FromTransactionTypeId: req.body.FromTransactionTypeId,
      ToTransactionTypeId: req.body.ToTransactionTypeId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    transactiontypebaseconversionmodel
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
