const contactaddresstype = require('../models/contactaddresstype.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let catFindById = await contactaddresstype.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.contactaddresstype.application.delete
  )

  if (catFindById == '404') {
    return res.status(404).send({
      message: 'ContactAddressType not found.',
    })
  }

  contactaddresstype
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

  contactaddresstype
    .getAll(tenantId, username)
    .then((catResp) => {
      res.status(200).send(catResp)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  contactaddresstype
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactaddresstype.application.fetchById
    )
    .then((catResp) => {
      res.status(200).send(catResp)
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
    let catFindById = await contactaddresstype.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactaddresstype.application.update
    )

    if (catFindById == '404') {
      return res.status(404).send({
        message: 'TransactionTypeStatus not found.',
      })
    }

    let cat = {
      Id: catFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? catFindById[0].Name : req.body.Name,
      Active: helper.isEmpty(req.body.Active)
        ? catFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await contactaddresstype
      .update(cat, username)
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
    // Create a Contact Address Type
    let cat = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    contactaddresstype
      .create(cat, username)
      .then((catResp) => {
        res.send(catResp)
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
