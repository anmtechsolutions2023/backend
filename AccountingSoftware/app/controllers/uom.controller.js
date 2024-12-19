const uom = require('../models/uom.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const decodeToken = require('../utils/extracttoken')

exports.updateUOM = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    let uomFindById = await uom.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.uom.application.update
    )

    if (uomFindById == '404') {
      return res.status(404).send({
        message: 'UOM not found.',
      })
    }

    let updatedUOM = {
      Id: uomFindById[0].Id,
      UnitName: helper.isEmpty(req.body.UnitName)
        ? uomFindById[0].UnitName
        : req.body.UnitName,
      IsPrimary: helper.isEmpty(req.body.IsPrimary)
        ? uomFindById[0].IsPrimary
        : req.body.IsPrimary,
      Active: helper.isEmpty(req.body.Active)
        ? uomFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await uom
      .update(updatedUOM, username)
      .then(() => {
        return res.status(200).send()
      })
      .catch((err) => {
        return res.status(500).send()
      })
  }
}

exports.deleteUOM = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let uomFindById = await uom.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.uom.application.delete
  )

  if (uomFindById == '404') {
    return res.status(404).send({
      message: 'UOM not found.',
    })
  }

  await uom
    .deleteUOM(req.params.id, tenantId, username)
    .then(() => {
      return res.status(204).send()
    })
    .catch((err) => {
      return res.status(500).send()
    })
}

exports.fetchAllUOMs = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  try {
    const uoms = await uom.getAll(tenantId, username)
    res.send(uoms)
  } catch (err) {
    res.sendStatus(500)
  }
}

exports.fetchUOMById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  uom
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.uom.application.fetchById
    )
    .then((uom) => {
      if (uom === 404) {
        return res.status(404).send({
          message: 'UOM not found.',
        })
      }
      res.send(uom)
    })
    .catch((err) => {
      res.sendStatus(500)
    })
}

exports.createUOM = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    // Create a UOM
    let um = {
      UnitName: req.body.UnitName,
      IsPrimary: req.body.IsPrimary,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    uom
      .create(um, username)
      .then((uomResp) => {
        res.send(uomResp)
      })
      .catch((err) => {
        switch (err) {
          case 'ER_DUP_ENTRY': {
            return res.sendStatus(409)
          }
        }
        res.sendStatus(500)
      })
  }
}
