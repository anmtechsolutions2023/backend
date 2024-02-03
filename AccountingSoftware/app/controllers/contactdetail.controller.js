const contactdetail = require('../models/contactdetail.model')
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
    let cdFindById = await contactdetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactdetail.application.update
    )

    if (cdFindById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
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

    await contactdetail
      .update(updatedcd, username)
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

  let cdFindById = await contactdetail.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.contactdetail.application.delete
  )

  if (cdFindById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  contactdetail
    .delete(req.params.id, tenantId, username)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

// /// This API is used to search Tax Group Detail by Group name
// exports.search = (req, res) => {
//   var decodedToken = decodeToken.decodeToken(req)

//   let tenantId = decodedToken.tenantId
//   let username = decodedToken.username

//   var queryParamName = queryParams.getQueryParams(req.query)['Name']
//   if (queryParamName === undefined) {
//     return res.status(400).send({
//       message: 'query param not supported!',
//     })
//   }

//   taxgrouptaxtypemapper
//     .searchByName(tenantId, username, queryParamName)
//     .then((tgttmresp) => {
//       res.status(200).send(tgttmresp)
//     })
//     .catch((err) => {
//       res.sendStatus(500).send()
//     })
// }

exports.fetchAll = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  contactdetail
    .getAll(tenantId, username)
    .then((cdResp) => {
      res.status(200).send(cdResp)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  contactdetail
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.contactdetail.application.fetchById
    )
    .then((cdResp) => {
      if (cdResp === 404) {
        return res.status(404).send({
          message: 'Record not found.',
        })
      }
      res.send(cdResp)
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

    contactdetail
      .create(cd, username)
      .then((cdResp) => {
        res.send(cdResp)
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
