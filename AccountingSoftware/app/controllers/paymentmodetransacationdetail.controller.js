const paymentmodetransactiondetailmodel = require('../models/paymentmodetransacationdetail.model')
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
    let findById = await paymentmodetransactiondetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentmodetransactiondetail.application.update
    )

    if (findById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedReq = {
      Id: findById[0].Id,
      PaymentModeId: helper.updateFieldValue(findById, req.body.PaymentModeId),
      RefNo: helper.updateFieldValue(findById, req.body.RefNo),
      Comment: helper.updateFieldValue(findById, req.body.Comment),
      CF1: helper.updateFieldValue(findById, req.body.CF1),
      CF2: helper.updateFieldValue(findById, req.body.CF2),
      CF3: helper.updateFieldValue(findById, req.body.CF3),
      CF4: helper.updateFieldValue(findById, req.body.CF4),
      Active: helper.updateFieldValue(findById, req.body.Active),
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await paymentmodetransactiondetailmodel
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

  let findById = await paymentmodetransactiondetailmodel.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.paymentmodetransactiondetail.application.delete
  )

  if (findById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  paymentmodetransactiondetailmodel
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

  paymentmodetransactiondetailmodel
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

  paymentmodetransactiondetailmodel
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
      PaymentModeId: resp.PaymentModeId,
      RefNo: resp.RefNo,
      Comment: resp.Comment,
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

    let paymentmode = {
      Id: resp.PaymentModeId,
      Type: resp.PaymentModeType,
      Active: resp.PaymentModeActive,
    }

    respObject.paymentmode = paymentmode

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  paymentmodetransactiondetailmodel
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.paymentmodetransactiondetail.application.fetchById
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
      PaymentModeId: req.body.PaymentModeId,
      RefNo: req.body.RefNo,
      Comment: req.body.Comment,
      CF1: req.body.CF1,
      CF2: req.body.CF2,
      CF3: req.body.CF3,
      CF4: req.body.CF4,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    paymentmodetransactiondetailmodel
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
