const paymentdetailmodel = require('../models/paymentdetail.model')
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
    let findById = await paymentdetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentdetail.application.update
    )

    if (findById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedReq = {
      Id: findById[0].Id,
      AccountTypeBaseId: helper.updateFieldValue(
        findById,
        req.body.AccountTypeBaseId
      ),
      TransactionDetailLogId: helper.updateFieldValue(
        findById,
        req.body.TransactionDetailLogId
      ),
      DiscountAmount: helper.updateFieldValue(
        findById,
        req.body.DiscountAmount
      ),
      RoundOff: helper.updateFieldValue(findById, req.body.RoundOff),
      TotalAmount: helper.updateFieldValue(findById, req.body.TotalAmount),
      TaxesAmount: helper.updateFieldValue(findById, req.body.TaxesAmount),
      GrossAmount: helper.updateFieldValue(findById, req.body.GrossAmount),
      UserId: helper.updateFieldValue(findById, req.body.UserId),
      Active: helper.updateFieldValue(findById, req.body.Active),
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await paymentdetailmodel
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

  let findById = await paymentdetailmodel.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.paymentdetail.application.delete
  )

  if (findById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  paymentdetailmodel
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

  paymentdetailmodel
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

  paymentdetailmodel
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
      AccountTypeBaseId: resp.AccountTypeBaseId,
      TransactionDetailLogId: resp.TransactionDetailLogId,
      DiscountAmount: resp.DiscountAmount,
      RoundOff: resp.RoundOff,
      TotalAmount: resp.TotalAmount,
      TaxesAmount: resp.TaxesAmount,
      GrossAmount: resp.GrossAmount,
      UserId: resp.UserId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let accounttypebase = {
      Id: resp.AccountTypeBaseId,
      Name: resp.AccountTypeBaseName,
      Active: resp.AccountTypeBaseActive,
    }

    let transactiondetaillog = {
      Id: resp.TransactionDetailLogId,
      AccountTypeBaseId: resp.TransactionDetailLogAccountTypeBaseId,
      UserId: resp.TransactionDetailLogUserId,
      TransactionDateTime: resp.TransactionDetailLogTransactionDateTime,
      Description: resp.TransactionDetailLogDescription,
      BranchDetailId: resp.TransactionDetailLogBranchDetailId,
      CF1: resp.TransactionDetailLogCF1,
      CF2: resp.TransactionDetailLogCF2,
      CF3: resp.TransactionDetailLogCF3,
      CF4: resp.TransactionDetailLogCF4,
      Active: resp.TransactionDetailLogActive,
    }

    respObject.accounttypebase = accounttypebase
    respObject.transactiondetaillog = transactiondetaillog

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  paymentdetailmodel
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentdetail.application.fetchById
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
      AccountTypeBaseId: req.body.AccountTypeBaseId,
      TransactionDetailLogId: req.body.TransactionDetailLogId,
      DiscountAmount: req.body.DiscountAmount,
      RoundOff: req.body.RoundOff,
      TotalAmount: req.body.TotalAmount,
      TaxesAmount: req.body.TaxesAmount,
      GrossAmount: req.body.GrossAmount,
      UserId: req.body.UserId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    paymentdetailmodel
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
