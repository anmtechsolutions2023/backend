const transactiontypestatus = require('../models/transactiontypestatus.model')
const logger = require('../utils/loggerHelper')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let ttsFindById = await transactiontypestatus.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.transactiontypestatus.application.delete
  )

  if (ttsFindById == '404') {
    return res.status(404).send({
      message: 'TransactionTypeStatus not found.',
    })
  }

  transactiontypestatus
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

  transactiontypestatus
    .getAll(tenantId, username)
    .then((atbResp) => {
      res.status(200).send(atbResp)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  transactiontypestatus
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypestatus.application.fetchById
    )
    .then((ttsResp) => {
      res.status(200).send(ttsResp)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

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
    let ttsFindById = await transactiontypestatus.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypestatus.application.fetchById
    )

    if (ttsFindById == '404') {
      return res.status(404).send({
        message: 'TransactionTypeStatus not found.',
      })
    }

    let tts = {
      Id: ttsFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? ttsFindById[0].Name : req.body.Name,
      Active: helper.isEmpty(req.body.Active)
        ? ttsFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await transactiontypestatus
      .update(tts, username)
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
    // Create a Transaction Type Status
    let tts = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    transactiontypestatus
      .create(tts, username)
      .then((ttsResp) => {
        res.send(ttsResp)
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
