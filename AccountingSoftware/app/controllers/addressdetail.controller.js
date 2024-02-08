const addressdetail = require('../models/addressdetail.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const decodeToken = require('../utils/extracttoken')
const queryParams = require('../utils/queyParams')
const { add } = require('winston')

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
    let adFindById = await addressdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.addressdetail.application.update
    )

    if (adFindById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedad = {
      Id: adFindById[0].Id,
      AddressLine1: helper.isEmpty(req.body.AddressLine1)
        ? adFindById[0].AddressLine1
        : req.body.AddressLine1,
      AddressLine2: helper.isEmpty(req.body.AddressLine2)
        ? adFindById[0].AddressLine2
        : req.body.AddressLine2,
      City: helper.isEmpty(req.body.City) ? adFindById[0].City : req.body.City,
      State: helper.isEmpty(req.body.State)
        ? adFindById[0].State
        : req.body.State,
      Pincode: helper.isEmpty(req.body.Pincode)
        ? adFindById[0].Pincode
        : req.body.Pincode,
      MapProviderLocationMapperId: helper.isEmpty(
        req.body.MapProviderLocationMapperId
      )
        ? adFindById[0].MapProviderLocationMapperId
        : req.body.MapProviderLocationMapperId,
      Landmark: helper.isEmpty(req.body.Landmark)
        ? adFindById[0].Landmark
        : req.body.Landmark,
      ContactAddressTypeId: helper.isEmpty(req.body.ContactAddressTypeId)
        ? adFindById[0].ContactAddressTypeId
        : req.body.ContactAddressTypeId,
      Active: helper.isEmpty(req.body.Active)
        ? adFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await addressdetail
      .update(updatedad, username)
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

  let adFindById = await addressdetail.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.addressdetail.application.delete
  )

  if (adFindById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  addressdetail
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

  addressdetail
    .getAll(tenantId, username)
    .then((adResp) => {
      res.status(200).send(translateResponse(adResp))
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

function translateResponse(adResp) {
  var addressDetailResp = []

  adResp.map((addressDetailMapper) => {
    var addressDetailJSON = {}

    let addressdetail = {
      Id: addressDetailMapper.Id,
      AddressLine1: addressDetailMapper.AddressLine1,
      AddressLine2: addressDetailMapper.AddressLine2,
      City: addressDetailMapper.City,
      State: addressDetailMapper.State,
      Pincode: addressDetailMapper.Pincode,
      Landmark: addressDetailMapper.Landmark,
      TenantId: addressDetailMapper.TenantId,
      Active: addressDetailMapper.Active,
      CreatedOn: addressDetailMapper.CreatedOn,
      CreatedBy: addressDetailMapper.CreatedBy,
      UpdatedOn: addressDetailMapper.UpdatedOn,
      UpdatedBy: addressDetailMapper.UpdatedBy,
    }

    let contactaddresstype = {
      Id: addressDetailMapper.ContactAddressTypeId,
      ContactAddressName: addressDetailMapper.ContactAddressName,
      Active: addressDetailMapper.ContactAddressActive,
    }

    let mapproviderlocationdetail = {
      Id: addressDetailMapper.MapProviderLocationDetailId,
      MapProviderId: addressDetailMapper.MapProviderId,
      LocationDetailId: addressDetailMapper.LocationDetailId,
      Active: addressDetailMapper.MapProviderLocationDetailActive,

      MapProvider: {
        Id: addressDetailMapper.MapProviderId,
        MapProviderName: addressDetailMapper.MapProviderName,
        Active: addressDetailMapper.MapProviderActive,
      },

      LocationDetail: {
        Id: addressDetailMapper.LocationDetailId,
        Lat: addressDetailMapper.LocationDetailLat,
        Lng: addressDetailMapper.LocationDetailLng,
        CF1: addressDetailMapper.LocationDetailCF1,
        CF2: addressDetailMapper.LocationDetailCF2,
        CF3: addressDetailMapper.LocationDetailCF3,
        CF4: addressDetailMapper.LocationDetailCF4,
        Active: addressDetailMapper.LocationDetailActive,
      },
    }

    addressDetailJSON.addressdetail = addressdetail
    addressDetailJSON.contactaddresstype = contactaddresstype
    addressDetailJSON.mapproviderlocationdetail = mapproviderlocationdetail

    addressDetailResp.push(addressDetailJSON)
  })

  return addressDetailResp
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  addressdetail
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.addressdetail.application.fetchById
    )
    .then((adResp) => {
      if (adResp === 404) {
        return res.status(404).send({
          message: 'Record not found.',
        })
      }
      res.status(200).send(translateResponse(adResp))
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
    let ad = {
      AddressLine1: req.body.AddressLine1,
      AddressLine2: req.body.AddressLine2,
      City: req.body.City,
      State: req.body.State,
      Pincode: req.body.Pincode,
      MapProviderLocationMapperId: req.body.MapProviderLocationMapperId,
      Landmark: req.body.Landmark,
      ContactAddressTypeId: req.body.ContactAddressTypeId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    addressdetail
      .create(ad, username)
      .then((adResp) => {
        res.send(adResp)
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
