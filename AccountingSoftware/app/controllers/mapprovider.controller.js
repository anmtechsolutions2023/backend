const mapProvider = require('../models/mapprovider.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let mapProviderFindById = await mapProvider.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.mapprovider.application.delete
  )

  if (mapProviderFindById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  mapProvider
    .delete(req.params.id, tenantId, username)
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

  mapProvider
    .getAll(tenantId, username)
    .then((mapProviderResp) => {
      res.status(200).send(mapProviderResp)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  mapProvider
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapprovider.application.fetchById
    )
    .then((mapProviderResp) => {
      if (mapProviderResp == '404') {
        return res.status(404).send({
          message: 'Record not found.',
        })
      }

      res.status(200).send(mapProviderResp)
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
    let mapProviderFindById = await mapProvider.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapprovider.application.update
    )

    if (mapProviderFindById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let mpReq = {
      Id: mapProviderFindById[0].Id,
      ProviderName: helper.isEmpty(req.body.ProviderName)
        ? mapProviderFindById[0].ProviderName
        : req.body.ProviderName,
      Active: helper.isEmpty(req.body.Active)
        ? mapProviderFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await mapProvider
      .update(mpReq, username)
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
    // Create a Map Provider
    let tg = {
      ProviderName: req.body.ProviderName,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    mapProvider
      .create(tg, username)
      .then((mapProviderResp) => {
        res.send(mapProviderResp)
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
