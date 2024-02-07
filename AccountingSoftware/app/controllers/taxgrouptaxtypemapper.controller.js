const taxgrouptaxtypemapper = require('../models/taxgrouptaxtypemapper.model')
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
    let tgttmFindById = await taxgrouptaxtypemapper.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.application.update
    )

    if (tgttmFindById == '404') {
      return res.status(404).send({
        message: 'Record not found.',
      })
    }

    let updatedtgttm = {
      Id: tgttmFindById[0].TaxGroupTaxTypeMapperId,
      TaxGroupId: helper.isEmpty(req.body.TaxGroupId)
        ? tgttmFindById[0].TaxGroupId
        : req.body.TaxGroupId,
      TaxTypeId: helper.isEmpty(req.body.TaxTypeId)
        ? tgttmFindById[0].TaxTypeId
        : req.body.TaxTypeId,
      Active: helper.isEmpty(req.body.Active)
        ? tgttmFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await taxgrouptaxtypemapper
      .update(updatedtgttm, username)
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

  let tgtymFindById = await taxgrouptaxtypemapper.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.taxgrouptaxtypemapper.application.delete
  )

  if (tgtymFindById == '404') {
    return res.status(404).send({
      message: 'Record not found.',
    })
  }

  taxgrouptaxtypemapper
    .delete(req.params.id, tenantId, username)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

/// This API is used to search Tax Group Detail by Group name
exports.search = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  var queryParamName = queryParams.getQueryParams(req.query)['Name']
  if (queryParamName === undefined) {
    return res.status(400).send({
      message: 'query param not supported!',
    })
  }

  taxgrouptaxtypemapper
    .searchByName(tenantId, username, queryParamName)
    .then((tgttmresp) => {
      res.status(200).send(translateResponse(tgttmresp))
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchAll = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  taxgrouptaxtypemapper
    .getAll(tenantId, username)
    .then((tgttmresp) => {
      res.status(200).send(translateResponse(tgttmresp))
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

function translateResponse(tgttmresp) {
  let tgttmDetails = []
  tgttmresp.map((resp) => {
    let mapper = {
      Id: resp.Id,
      TaxGroupId: resp.TaxGroupId,
      TaxTypeId: resp.TaxTypeId,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let taxgroup = {
      Id: resp.TaxGroupId,
      Name: resp.TaxGroupName,
      Active: resp.TaxGroupActive,
    }

    let taxtype = {
      Id: resp.TaxTypeId,
      Name: resp.TaxTypeName,
      Value: resp.TaxTypeValue,
      Active: resp.TaxTypeActive,
    }

    mapper.taxgroup = taxgroup
    mapper.taxtype = taxtype

    tgttmDetails.push(mapper)
  })
  return tgttmDetails
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  taxgrouptaxtypemapper
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.taxgrouptaxtypemapper.application.fetchById
    )
    .then((tgttmresp) => {
      if (tgttmresp === 404) {
        return res.status(404).send({
          message: 'Record not found.',
        })
      }

      res.send(translateResponse(tgttmresp))
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
    // Create a Tax Group Tax Type Mapper
    let tgttm = {
      TaxGroupId: req.body.TaxGroupId,
      TaxTypeId: req.body.TaxTypeId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    taxgrouptaxtypemapper
      .create(tgttm, username)
      .then((tgttmResp) => {
        res.send(tgttmResp)
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
