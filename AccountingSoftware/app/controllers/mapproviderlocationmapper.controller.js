const mapproviderlocationmapper = require('../models/mapproviderlocationmapper.model')
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
    let mplmFindById = await mapproviderlocationmapper.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapproviderlocationmapper.application.update
    )

    if (mplmFindById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedmplm = {
      Id: mplmFindById[0].MapProviderLocationDetailId,
      MapProviderId: helper.isEmpty(req.body.MapProviderId)
        ? mplmFindById[0].MapProviderId
        : req.body.MapProviderId,
      LocationDetailId: helper.isEmpty(req.body.LocationDetailId)
        ? mplmFindById[0].LocationDetailId
        : req.body.LocationDetailId,
      Active: helper.isEmpty(req.body.Active)
        ? mplmFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await mapproviderlocationmapper
      .update(updatedmplm, username)
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

  let tgtymFindById = await mapproviderlocationmapper.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.mapproviderlocationmapper.application.delete
  )

  if (tgtymFindById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  mapproviderlocationmapper
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

  mapproviderlocationmapper
    .getAll(tenantId, username)
    .then((mplmResp) => {
      res.status(200).send(mplmResp)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  mapproviderlocationmapper
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.mapproviderlocationmapper.application.fetchById
    )
    .then((mplmResp) => {
      if (mplmResp === 404) {
        return res.status(404).send({
          message: 'Record not found.',
        })
      }
      res.send(mplmResp)
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
    // Create a record
    let mplm = {
      MapProviderId: req.body.MapProviderId,
      LocationDetailId: req.body.LocationDetailId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    mapproviderlocationmapper
      .create(mplm, username)
      .then((mplmResp) => {
        res.send(mplmResp)
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
