const accounttypebase = require('../models/accounttypebase.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let atbFindById = await accounttypebase.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.accounttypebase.application.delete
  )

  if (atbFindById == '404') {
    return res.status(404).send({
      message: 'AccountTypeBase not found.',
    })
  }

  accounttypebase
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

  accounttypebase
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

  accounttypebase
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.accounttypebase.application.fetchById
    )
    .then((atbResp) => {
      res.status(200).send(atbResp)
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
    let atbFindById = await accounttypebase.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.accounttypebase.application.update
    )

    if (atbFindById == '404') {
      return res.status(404).send({
        message: 'AccountTypeBase not found.',
      })
    }

    let atb = {
      Id: atbFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? atbFindById[0].Name : req.body.Name,
      Active: helper.isEmpty(req.body.Active)
        ? atbFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await accounttypebase
      .update(atb, username)
      .then(() => {
        res.status(200).send()
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
    // Create a Account Type Base
    let atb = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    accounttypebase
      .create(atb, username)
      .then((atbResp) => {
        res.send(atbResp)
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
