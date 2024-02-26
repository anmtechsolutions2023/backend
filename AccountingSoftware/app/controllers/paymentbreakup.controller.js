const paymentbreakupmodel = require('../models/paymentbreakup.model')
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
    let findById = await paymentbreakupmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentbreakup.application.update
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
      PaymentDetailId: helper.updateFieldValue(
        findById,
        req.body.PaymentDetailId
      ),
      PaymentModeTransactionDetailId: helper.updateFieldValue(
        findById,
        req.body.PaymentModeTransactionDetailId
      ),
      PaymentReceivedTypeId: helper.updateFieldValue(
        findById,
        req.body.PaymentReceivedTypeId
      ),
      UserId: helper.updateFieldValue(findById, req.body.UserId),
      Active: helper.updateFieldValue(findById, req.body.Active),
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await paymentbreakupmodel
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

  let findById = await paymentbreakupmodel.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.paymentbreakup.application.delete
  )

  if (findById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  paymentbreakupmodel
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

  paymentbreakupmodel
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

  paymentbreakupmodel
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
      PaymentDetailId: resp.PaymentDetailId,
      PaymentModeTransactionDetailId: resp.PaymentModeTransactionDetailId,
      PaymentReceivedTypeId: resp.PaymentReceivedTypeId,
      UserId: resp.UserId,
      Timestamp: resp.Timestamp,
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

    let paymentdetail = {
      Id: resp.PaymentDetailId,
      AccountTypeBaseId: resp.PaymentDetailAccountTypeBaseId,
      TransactionDetailLogId: resp.PaymentDetailTransactionDetailLogId,
      DiscountAmount: resp.PaymentDetailDiscountAmount,
      RoundOff: resp.PaymentDetailRoundOff,
      TotalAmount: resp.PaymentDetailTotalAmount,
      TaxesAmount: resp.PaymentDetailTaxesAmount,
      GrossAmount: resp.PaymentDetailGrossAmount,
      UserId: resp.PaymentDetailUserId,
      Active: resp.PaymentDetailActive,
    }

    let paymentmodetransactiondetail = {
      Id: resp.PaymentModeTransactionDetailId,
      PaymentModeId: resp.PaymentModeTransactionDetailPaymentModeId,
      RefNo: resp.PaymentModeTransactionDetailRefNo,
      Comment: resp.PaymentModeTransactionDetailComment,
      CF1: resp.PaymentModeTransactionDetailCF1,
      CF2: resp.PaymentModeTransactionDetailCF2,
      CF3: resp.PaymentModeTransactionDetailCF3,
      CF4: resp.PaymentModeTransactionDetailCF4,
      Active: resp.PaymentModeTransactionDetailActive,
    }

    let paymentreceivedtype = {
      Id: resp.PaymentReceivedId,
      Type: resp.PaymentReceivedType,
      Active: resp.PaymentReceivedActive,
    }

    respObject.accounttypebase = accounttypebase
    respObject.paymentdetail = paymentdetail
    respObject.paymentmodetransactiondetail = paymentmodetransactiondetail
    respObject.paymentreceivedtype = paymentreceivedtype

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  paymentbreakupmodel
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentbreakup.application.fetchById
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
      PaymentDetailId: req.body.PaymentDetailId,
      PaymentModeTransactionDetailId: req.body.PaymentModeTransactionDetailId,
      PaymentReceivedTypeId: req.body.PaymentReceivedTypeId,
      UserId: req.body.UserId,
      Timestamp: new Date(),
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    paymentbreakupmodel
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
