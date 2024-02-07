const transactiontype = require('../models/transactiontype.model')
const logger = require('../utils/loggerHelper')
const helper = require('../utils/helper')
const decodeToken = require('../utils/extracttoken')
const moduleNames = require('../config/modulenames')
const { log } = require('winston')

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
    let ttFindById = await transactiontype.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypes.application.update
    )

    if (ttFindById == '404') {
      return res.status(404).send({
        message: 'Transaction Type not found.',
      })
    }

    let updatedtt = {
      Id: ttFindById[0].Id,
      Name: helper.isEmpty(req.body.Name) ? ttFindById[0].Name : req.body.Name,
      TransactionTypeConfigId: helper.isEmpty(req.body.TransactionTypeConfigId)
        ? ttFindById[0].TTCId
        : req.body.TransactionTypeConfigId,
      Active: helper.isEmpty(req.body.Active)
        ? ttFindById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    await transactiontype
      .update(updatedtt, username)
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

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let ttFindById = await transactiontype.findById(
    req.params.id,
    tenantId,
    username,
    moduleNames.transactiontypes.application.delete
  )

  if (ttFindById == '404') {
    return res.status(404).send({
      message: 'TransactionType not found.',
    })
  }

  transactiontype
    .delete(req.params.id, tenantId, username)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.transactiontypes.application.delete,
        logger.logType.error,
        `Error occurrd for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
      )
      res.sendStatus(500).send()
    })
}

exports.fetchAll = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  transactiontype
    .getAll(tenantId, username)
    .then((tt) => {
      let ttDetail = []
      tt.map((t) => {
        let ttc = {
          Id: t.TTCId,
          StartCounterNo: t.TTCStartCounterNo,
          Prefix: t.TTCPrefix,
          Format: t.TTCFormat,
          Active: t.TTCActive,
          TenantId: t.TTCTenantId,
        }

        let transactiontype = {
          Id: t.Id,
          Name: t.Name,
          TransactionTypeConfigId: t.TransactionTypeConfigId,
          Active: t.Active,
          TenantId: t.TenantId,
          TransactionTypeConfig: ttc,
        }

        ttDetail.push(transactiontype)
      })

      res.status(200).send(ttDetail)
    })
    .catch((err) => {
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  transactiontype
    .findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypes.application.fetchById
    )
    .then((ttResp) => {
      if (ttResp === 404) {
        return res.send(ttResp)
      }

      let ttDetail = []
      ttResp.map((t) => {
        let ttc = {
          Id: t.TTCId,
          StartCounterNo: t.TTCStartCounterNo,
          Prefix: t.TTCPrefix,
          Format: t.TTCFormat,
          Active: t.TTCActive,
          TenantId: t.TTCTenantId,
        }

        let transactiontype = {
          Id: t.Id,
          Name: t.Name,
          TransactionTypeConfigId: t.TransactionTypeConfigId,
          Active: t.Active,
          TenantId: t.TenantId,
          TransactionTypeConfig: ttc,
        }

        ttDetail.push(transactiontype)
      })

      res.status(200).send(ttDetail)
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
    // Create a Transaction Type
    let ttDetail = {
      Name: req.body.Name,
      TransactionTypeConfigId: req.body.TransactionTypeConfigId,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    transactiontype
      .create(ttDetail, username)
      .then((ttResp) => {
        res.send(ttResp)
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
