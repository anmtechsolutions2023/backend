const taxTypes = require('../models/taxtype.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')

exports.deleteTaxType = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let taxTypeFindById = await taxTypes.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.taxtypes.application.delete
  )

  if (taxTypeFindById == '404') {
    return res.status(404).send({
      message: 'Tax type not found.',
    })
  }

  taxTypes
    .deleteTaxType(req.params.id, tenantId, username)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchAllTaxTypes = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  taxTypes
    .getAll(tenantId, username)
    .then((taxtypes) => {
      res.status(200).send(taxtypes)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchTaxTypeById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  taxTypes
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxtypes.application.fetchById
    )
    .then((taxType) => {
      if (taxType == '404') {
        return res.status(404).send({
          message: 'Tax type not found.',
        })
      }

      res.status(200).send(taxType)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.updateTaxType = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    let taxTypeFindById = await taxTypes.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxtypes.application.update
    )

    if (taxTypeFindById == '404') {
      return res.status(404).send({
        message: 'Tax type not found.',
      })
    }

    let tt = {
      Id: taxTypeFindById[0].Id,
      Name: helper.isEmpty(req.body.Name)
        ? taxTypeFindById[0].Name
        : req.body.Name,
      Value: helper.isEmpty(req.body.Value)
        ? taxTypeFindById[0].Value
        : req.body.Value,
      Active: helper.isEmpty(req.body.Active)
        ? taxTypeFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await taxTypes
      .update(tt, username)
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

exports.createTaxType = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    // Create a taxtype
    let tt = {
      Name: req.body.Name,
      Value: req.body.Value,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    taxTypes
      .create(tt, username)
      .then((taxTypeResp) => {
        res.send(taxTypeResp)
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
