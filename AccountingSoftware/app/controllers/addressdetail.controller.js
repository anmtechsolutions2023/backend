const addressdetail = require('../models/addressdetail.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')
const commonControllerErrorHandler = require('../common/errorhandle.common')

exports.update = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

    let adFindById = await addressdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.addressdetail.application.update
    )

    if (adFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.addressdetail.notFound'),
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

    // update record in database
    return res
      .status(await addressdetail.update(updatedad, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.addressdetail.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    let adFindById = await addressdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.addressdetail.application.delete
    )

    if (adFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.addressdetail.notFound'),
      })
    }

    await addressdetail.deleteById(req.params.id, tenantId, username)

    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.addressdetail.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    const adResp = await addressdetail.getAll(tenantId, username)
    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(adResp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.addressdetail.internalServerError',
      res
    )
  }
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

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const adResp = await addressdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.addressdetail.application.fetchById
    )

    if (adResp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.addressdetail.notFound'),
      })
    }

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(adResp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.addressdetail.internalServerError',
      res
    )
  }
}

exports.create = async (req, res) => {
  try {
    const { tenantId, username } = req

    // Validate request
    if (!Object.keys(req.body).length) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    }

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

    const adResp = await addressdetail.create(ad, username)

    return res.status(statusCodes.HTTP_STATUS_CREATED).send(adResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.addressdetail.internalServerError',
      res
    )
  }
}
