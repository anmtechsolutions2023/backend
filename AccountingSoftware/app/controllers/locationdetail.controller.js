const locationDetail = require('../models/locationdetail.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let locationDetailFindById = await locationDetail.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.locationdetail.application.delete
  )

  if (locationDetailFindById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  locationDetail
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

  locationDetail
    .getAll(tenantId, username)
    .then((locationdetailResp) => {
      res.status(200).send(locationdetailResp)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  locationDetail
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.locationdetail.application.fetchById
    )
    .then((locationdetailResp) => {
      if (locationdetailResp == '404') {
        return res.status(404).send({
          message: 'Record not found.',
        })
      }

      res.status(200).send(locationdetailResp)
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
    let locationDetailFindById = await locationDetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.locationdetail.application.update
    )

    if (locationDetailFindById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let ldReq = {
      Id: locationDetailFindById[0].Id,
      Lat: helper.isEmpty(req.body.Lat)
        ? locationDetailFindById[0].Lat
        : req.body.Lat,
      Lng: helper.isEmpty(req.body.Lng)
        ? locationDetailFindById[0].Lng
        : req.body.Lng,

      CF1: helper.isEmpty(req.body.CF1)
        ? locationDetailFindById[0].CF1
        : req.body.CF1,
      CF2: helper.isEmpty(req.body.CF2)
        ? locationDetailFindById[0].CF2
        : req.body.CF2,
      CF3: helper.isEmpty(req.body.CF3)
        ? locationDetailFindById[0].CF3
        : req.body.CF3,
      CF4: helper.isEmpty(req.body.CF4)
        ? locationDetailFindById[0].CF4
        : req.body.CF4,
      Active: helper.isEmpty(req.body.Active)
        ? locationDetailFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await locationDetail
      .update(ldReq, username)
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
    // Create a location detail
    let ld = {
      Lat: req.body.Lat,
      Lng: req.body.Lng,
      CF1: req.body.CF1,
      CF2: req.body.CF2,
      CF3: req.body.CF3,
      CF4: req.body.CF4,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    locationDetail
      .create(ld, username)
      .then((locationDetailResp) => {
        res.send(locationDetailResp)
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
