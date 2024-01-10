const uomfactor = require('../models/uomfactor.model')
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
    let uomfFindById = await uomfactor.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.uomfactor.application.update
    )

    if (uomfFindById == '404') {
      return res.status(404).send({
        message: 'UOMFactor not found.',
      })
    }

    let updateuomf = {
      Id: uomfFindById[0].Id,
      PrimaryUOMId: helper.isEmpty(req.body.PrimaryUOMId)
        ? uomfFindById[0].PrimaryUOMId
        : req.body.PrimaryUOMId,
      SecondaryUOMId: helper.isEmpty(req.body.SecondaryUOMId)
        ? uomfFindById[0].SecondaryUOMId
        : req.body.SecondaryUOMId,
      Factor: helper.isEmpty(req.body.Factor)
        ? uomfFindById[0].Factor
        : req.body.Factor,
      Active: helper.isEmpty(req.body.Active)
        ? uomfFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await uomfactor
      .update(updateuomf, username)
      .then(() => {
        res.status(200).send()
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

  let uomfFindById = await uomfactor.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.uomfactor.application.delete
  )

  if (uomfFindById == '404') {
    return res.status(404).send({
      message: 'UOMFactor not found.',
    })
  }

  uomfactor
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

  uomfactor
    .getAll(tenantId, username)
    .then((uomf) => {
      let uomfDetail = []
      uomf.map((uf) => {
        let primaryuom = {
          PrimaryUOMId: uf.PrimaryUOMId,
          PrimaryUOMName: uf.PrimaryUnitName,
          PrimaryUOMActive: uf.PrimaryUnitNameActive,
        }

        let secondaryuom = {
          SecondaryUOMId: uf.SecondaryUOMId,
          SecondaryUOMName: uf.SecondayUnitName,
          SecondaryUOMActive: uf.SecondayUnitActive,
        }

        let uomf = {
          Id: uf.Id,
          Factor: uf.Factor,
          TenantId: uf.TenantId,
          Active: uf.Active,
          PrimaryUOM: primaryuom,
          SecondayUOM: secondaryuom,
        }

        uomfDetail.push(uomf)
      })

      res.status(200).send(uomfDetail)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  uomfactor
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.uomfactor.application.fetchById
    )
    .then((uomf) => {
      if (uomf === 404) {
        return res.status(404).send({
          message: 'UOM factor not found.',
        })
      }

      let uomfDetail = []
      uomf.map((uf) => {
        let primaryuom = {
          PrimaryUOMId: uf.PrimaryUOMId,
          PrimaryUOMName: uf.PrimaryUnitName,
          PrimaryUOMActive: uf.PrimaryUnitNameActive,
        }

        let secondaryuom = {
          SecondaryUOMId: uf.SecondaryUOMId,
          SecondaryUOMName: uf.SecondayUnitName,
          SecondaryUOMActive: uf.SecondayUnitActive,
        }

        let uomf = {
          Id: uf.Id,
          Factor: uf.Factor,
          TenantId: uf.TenantId,
          Active: uf.Active,
          PrimaryUOM: primaryuom,
          SecondayUOM: secondaryuom,
        }

        uomfDetail.push(uomf)
      })

      res.status(200).send(uomfDetail)
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
    // Create a UOM Factor
    let uomf = {
      PrimaryUOMId: req.body.PrimaryUOMId,
      SecondaryUOMId: req.body.SecondaryUOMId,
      Factor: req.body.Factor,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    uomfactor
      .create(uomf, username)
      .then((uomfResp) => {
        res.send(uomfResp)
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
