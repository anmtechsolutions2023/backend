const categorydetail = require('../models/categorydetail.model')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')

exports.updateCategoryDetail = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    let cdFindById = await categorydetail.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.categorydetail.application.update
    )

    if (cdFindById == '404') {
      return res.status(404).send({
        message: 'CategoryDetail not found.',
      })
    }

    let updatedCategoryDetail = {
      Id: cdFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? cdFindById[0].Name : req.body.Name,
      Active: helper.isEmpty(req.body.Active)
        ? cdFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await categorydetail
      .update(updatedCategoryDetail, username)
      .then(() => {
        return res.status(200).send()
      })
      .catch((err) => {
        return res.status(500).send()
      })
  }
}

exports.deleteCategoryDetail = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let cdFindById = await categorydetail.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.categorydetail.application.delete
  )

  if (cdFindById == '404') {
    return res.status(404).send({
      message: 'CategoryDetail not found.',
    })
  }

  categorydetail
    .deleteCategoryDetail(req.params.id, tenantId, username)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchAllCategoryDetails = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  categorydetail
    .getAll(tenantId, username)
    .then((cd) => {
      res.send(cd)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchCategoryDetailById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  categorydetail
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.categorydetail.application.fetchById
    )
    .then((cd) => {
      if (cd === 404) {
        return res.status(404).send({
          message: 'Category Detail not found.',
        })
      }

      res.status(200).send(cd)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.createCategoryDetail = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    // Create a Category Detail
    let cd = {
      Name: req.body.Name,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    categorydetail
      .create(cd, username)
      .then((cdResp) => {
        res.send(cdResp)
      })
      .catch((err) => {
        switch (err) {
          case 'ER_DUP_ENTRY': {
            return res.sendStatus(409)
          }
        }
        res.sendStatus(500).send()
      })
  }
}
