const taxGroup = require('../models/taxgroup.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let taxGroupFindById = await taxGroup.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.taxgroup.application.delete
  )

  if (taxGroupFindById == '404') {
    return res.status(404).send({
      message: 'Tax group not found.',
    })
  }

  taxGroup
    .deletetaxGroup(req.params.id, tenantId, username)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchAll = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  taxGroup
    .getAll(tenantId, username)
    .then((taxgroups) => {
      res.status(200).send(taxgroups)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  taxGroup
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgroup.application.fetchById
    )
    .then((taxGroupResp) => {
      if (taxGroupResp == '404') {
        return res.status(404).send({
          message: 'Tax group not found.',
        })
      }

      res.status(200).send(taxGroupResp)
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
    let taxGroupFindById = await taxGroup.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgroup.application.update
    )

    if (taxGroupFindById == '404') {
      return res.status(404).send({
        message: 'Tax Group not found.',
      })
    }

    let tg = {
      Id: taxGroupFindById[0].Id,
      Name: helper.isEmpty(req.body.Name)
        ? taxGroupFindById[0].Name
        : req.body.Name,
      Value: helper.isEmpty(req.body.Value)
        ? taxGroupFindById[0].Value
        : req.body.Value,
      Active: helper.isEmpty(req.body.Active)
        ? taxGroupFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await taxGroup
      .update(tg, username)
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
    // Create a tax group
    let tg = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    taxGroup
      .create(tg, username)
      .then((taxGroupResp) => {
        res.send(taxGroupResp)
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
