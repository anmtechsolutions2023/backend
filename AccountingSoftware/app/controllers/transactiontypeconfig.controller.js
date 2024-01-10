const transactiontypeconfig = require('../models/transactiontypeconfig.model')
const logger = require('../utils/loggerHelper')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')

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
    let ttcFindById = await transactiontypeconfig.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypeconfig.application.update
    )

    if (ttcFindById == '404') {
      return res.status(404).send({
        message: 'TransactionTypeDetail not found.',
      })
    }

    let updatedttc = {
      Id: ttcFindById[0].Id,
      StartCounterNo: helper.isEmpty(req.body.StartCounterNo)
        ? ttcFindById[0].StartCounterNo
        : req.body.StartCounterNo,
      Prefix: helper.isEmpty(req.body.Prefix)
        ? ttcFindById[0].Prefix
        : req.body.Prefix,
      Format: helper.isEmpty(req.body.Format)
        ? ttcFindById[0].Format
        : req.body.Format,
      Active: helper.isEmpty(req.body.Active)
        ? ttcFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await transactiontypeconfig
      .update(updatedttc, username)
      .then(() => {
        return res.status(200).send()
      })
      .catch((err) => {
        switch (err) {
          case 'ER_DUP_ENTRY': {
            return res.sendStatus(409).send()
          }
        }
        return res.sendStatus(500).send()
      })
  }
}

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let ttcFindById = await transactiontypeconfig.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.transactiontypeconfig.application.delete
  )

  if (ttcFindById == '404') {
    return res.status(404).send({
      message: 'TransactionTypeDetail not found.',
    })
  }

  transactiontypeconfig
    .delete(req.params.id, tenantId, username)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchAll = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  transactiontypeconfig
    .getAll(tenantId, username)
    .then((ttc) => {
      res.send(ttc)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  transactiontypeconfig
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypeconfig.application.fetchById
    )
    .then((cd) => {
      if (cd == '404') {
        return res.status(404).send({
          message: 'Transaction Type Config not found.',
        })
      }

      res.status(200).send(cd)
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
    // Create a Transaction Type Config
    let ttc = {
      StartCounterNo: req.body.StartCounterNo,
      Prefix: req.body.Prefix,
      Format: req.body.Format,
      Active: req.body.Active,
      TenantId: req.body.TenantId,
      CreatedOn: new Date(),
      CreatedBy: tenantId,
    }

    transactiontypeconfig
      .create(ttc, username)
      .then((ttcResp) => {
        res.send(ttcResp)
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
