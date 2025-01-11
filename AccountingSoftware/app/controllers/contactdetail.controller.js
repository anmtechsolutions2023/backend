const contactdetail = require('../models/contactdetail.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const queryParams = require('../utils/queyParams')
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

    let cdFindById = await contactdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactdetail.application.update
    )

    if (cdFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.contactdetail.notFound'),
      })
    }

    let updatedcd = {
      Id: cdFindById[0].Id,
      FirstName: helper.isEmpty(req.body.FirstName)
        ? cdFindById[0].FirstName
        : req.body.FirstName,
      LastName: helper.isEmpty(req.body.LastName)
        ? cdFindById[0].LastName
        : req.body.LastName,
      MobileNo: helper.isEmpty(req.body.MobileNo)
        ? cdFindById[0].MobileNo
        : req.body.MobileNo,
      AltMobileNo: helper.isEmpty(req.body.AltMobileNo)
        ? cdFindById[0].AltMobileNo
        : req.body.AltMobileNo,
      Landline1: helper.isEmpty(req.body.Landline1)
        ? cdFindById[0].Landline1
        : req.body.Landline1,
      Landline2: helper.isEmpty(req.body.Landline2)
        ? cdFindById[0].Landline2
        : req.body.Landline2,
      Ext1: helper.isEmpty(req.body.Ext1) ? cdFindById[0].Ext1 : req.body.Ext1,
      Ext2: helper.isEmpty(req.body.Ext2) ? cdFindById[0].Ext2 : req.body.Ext2,
      ContactAddressTypeId: helper.isEmpty(req.body.ContactAddressTypeId)
        ? cdFindById[0].ContactAddressTypeId
        : req.body.ContactAddressTypeId,
      Active: helper.isEmpty(req.body.Active)
        ? cdFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    // Update record in database
    return res
      .status(await contactdetail.update(updatedcd, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.contactdetail.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    let cdFindById = await contactdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactdetail.application.delete
    )

    if (cdFindById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.contactdetail.notFound'),
      })
    }

    await contactdetail.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.contactdetail.internalServerError',
      res
    )
  }
}

exports.search = async (req, res) => {
  try {
    const { tenantId, username } = req

    var params = queryParams.getQueryParams(req.query)

    var queryParamName = params['QueryParamName']
    var queryParamValue = params['QueryParamValue']

    if (helper.isEmpty(queryParamName) || helper.isEmpty(queryParamValue)) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.modules.contactdetail.queryParamMissing'),
      })
    }

    const cdResp = await contactdetail.searchByParam(tenantId, username, params)

    if (cdResp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.contactdetail.queryParamNotSupported'
        ),
      })
    }

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(cdResp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.contactdetail.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    const cdResp = await contactdetail.getAll(tenantId, username)
    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(cdResp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.contactdetail.internalServerError',
      res
    )
  }
}

function translateResponse(cdResp) {
  var contactDetailsResp = []
  cdResp.map((resp) => {
    var contactDetailResp = {
      Id: resp.Id,
      FirstName: resp.FirstName,
      LastName: resp.LastName,
      MobileNo: resp.MobileNo,
      AltMobileNo: resp.AltMobileNo,
      Landline1: resp.Landline1,
      Landline2: resp.Landline2,
      Ext1: resp.Ext1,
      Ext2: resp.Ext2,
      ContactAddressTypeId: resp.ContactAddressTypeId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    var contactaddresstype = {
      Id: resp.ContactAddressTypeId,
      Name: resp.ContactAddressName,
      Active: resp.ContactAddressActive,
    }

    contactDetailResp.contactaddresstype = contactaddresstype
    contactDetailsResp.push(contactDetailResp)
  })

  return contactDetailsResp
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const cdResp = await contactdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactdetail.application.fetchById
    )

    if (cdResp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.contactdetail.notFound'),
      })
    }
    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(cdResp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.contactdetail.internalServerError',
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
    let cd = {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      MobileNo: req.body.MobileNo,
      AltMobileNo: req.body.AltMobileNo,
      Landline1: req.body.Landline1,
      Landline2: req.body.Landline2,
      Landline2: req.body.Landline2,
      Ext1: req.body.Ext1,
      Ext2: req.body.Ext2,
      ContactAddressTypeId: req.body.ContactAddressTypeId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const cdResp = await contactdetail.create(cd, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(cdResp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.contactdetail.internalServerError',
      res
    )
  }
}
