const organizationdetail = require('../models/organizationdetail.model')
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
    let odFindById = await organizationdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.organizationdetail.application.update
    )

    if (odFindById == '404') {
      return res.status(404).send({
        message: 'OrganizationDetail not found.',
      })
    }

    let updatedod = {
      Id: odFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? odFindById[0].Name : req.body.Name,
      Active: helper.isEmpty(req.body.Active)
        ? odFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await organizationdetail
      .update(updatedod, username)
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

  let odFindById = await organizationdetail.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.organizationdetail.application.delete
  )

  if (odFindById == '404') {
    return res.status(404).send({
      message: 'OrganizationDetail not found.',
    })
  }

  organizationdetail
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

  organizationdetail
    .getAll(tenantId, username)
    .then((od) => {
      res.status(200).send(od)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  organizationdetail
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.organizationdetail.application.fetchById
    )
    .then((od) => {
      res.status(200).send(od)
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
    // Create a Organization Detail
    let od = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: tenantId,
    }

    organizationdetail
      .create(od, username)
      .then((odResp) => {
        res.send(odResp)
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
