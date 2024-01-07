const transactiontypeconfig = require('../models/transactiontypeconfig.model')
const logger = require('../utils/loggerHelper')
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
    let ttcFindById = await transactiontypeconfig.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiontypeconfig.application.update
    )

    if (ttcFindById == '404') {
      logger.loggerHelper(
        tenantId,
        username,
        'TransactionTypeDetail_update',
        logger.logType.error,
        `Record not found for Id: ${req.params.id}`
      )
      return res.status(404).send({
        message: 'TransactionTypeDetail not found.',
      })
    }

    let updatedttc = {
      Id: ttcFindById[0].Id,
      StartCounterNo: helper.isEmpty(req.body.StartCounterNo)
        ? ttcFindById[0].StartCounterNo
        : req.body.StartCounterNo,
      Prefix: helper.isEmpty(req.body.Prefix)
        ? ttcFindById[0].Prefix
        : req.body.Prefix,
      Format: helper.isEmpty(req.body.Format)
        ? ttcFindById[0].Format
        : req.body.Format,
      Active: helper.isEmpty(req.body.Active)
        ? ttcFindById[0].Active
        : req.body.Active,
      TenantId: helper.isEmpty(req.body.TenantId)
        ? ttcFindById[0].TenantId
        : req.body.TenantId,
      UpdatedOn: new Date(),
      UpdatedBy: 'from_token', // Get ths value from Bearer Token
    }

    await transactiontypeconfig
      .update(updatedttc, username)
      .then(() => {
        logger.loggerHelper(
          tenantId,
          username,
          'TransactionTypeDetail_update',
          logger.logType.debug,
          `Record updated for Id: ${updatedttc.Id}`
        )
        return res.status(200).send()
      })
      .catch((err) => {
        logger.loggerHelper(
          tenantId,
          username,
          'TransactionTypeDetail_update',
          logger.logType.error,
          `Record not updated for Id: ${updatedttc.Id}, Error: ${err} `
        )
        return res.status(500).send()
      })
  }
}

exports.delete = async (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  let ttcFindById = await transactiontypeconfig.findById(
    req.params.id,
    tenantId,
    username,
    'TransactionTypeDetail_delete'
  )

  if (ttcFindById == '404') {
    logger.loggerHelper(
      tenantId,
      username,
      'TransactionTypeDetail_delete',
      logger.logType.error,
      `Record not found for Id: ${req.params.id}`
    )
    return res.status(404).send({
      message: 'TransactionTypeDetail not found.',
    })
  }

  transactiontypeconfig
    .delete(req.params.id, tenantId, username)
    .then(() => {
      logger.loggerHelper(
        tenantId,
        username,
        'TransactionTypeDetail_delete',
        logger.logType.debug,
        `Record deleted for Id: ${req.params.id}`
      )
      res.status(204).send()
    })
    .catch((err) => {
      logger.loggerHelper(
        tenantId,
        username,
        'TransactionTypeDetail_delete',
        logger.logType.error,
        `Error occurred for Id: ${req.params.id}`
      )
      res.sendStatus(500).send()
    })
}

exports.fetchAll = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  transactiontypeconfig
    .getAll(tenantId, username)
    .then((ttc) => {
      logger.loggerHelper(
        tenantId,
        username,
        'TransactionTypeConfig_fetchAll',
        logger.logType.debug,
        'Success'
      )
      res.send(ttc)
    })
    .catch((err) => {
      logger.loggerHelper(
        tenantId,
        username,
        'TransactionTypeConfig_fetchAll',
        logger.logType.error,
        `Error: ${err}`
      )
      res.sendStatus(500).send()
    })
}

exports.fetchById = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  transactiontypeconfig
    .findById(
      req.params.id,
      tenantId,
      username,
      'TransactionTypeConfig_fetchById'
    )
    .then((cd) => {
      if (cd === 404) {
        logger.loggerHelper(
          tenantId,
          username,
          'TransactionTypeConfig_fetchById',
          logger.logType.debug,
          `Record not found for Id: ${req.params.id}`
        )
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          'TransactionTypeConfig_fetchById',
          logger.logType.debug,
          `Record found for Id: ${req.params.id}`
        )
      }
      res.send(cd)
    })
    .catch((err) => {
      logger.loggerHelper(
        tenantId,
        username,
        'TransactionTypeConfig_fetchById',
        logger.logType.error,
        `Error occurred for Id: ${req.params.id}, Error: ${err}`
      )
      res.sendStatus(500).send()
    })
}

exports.create = (req, res) => {
  var decodedToken = decodeToken.decodeToken(req)

  let tenantId = decodedToken.tenantId
  let username = decodedToken.username

  // Validate request
  if (!Object.keys(req.body).length) {
    logger.loggerHelper(
      tenantId,
      username,
      'TransactionTypeConfig_create',
      logger.logType.error,
      'Empty Content'
    )
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  } else {
    // Create a Transaction Type Config
    let ttc = {
      StartCounterNo: req.body.StartCounterNo,
      Prefix: req.body.Prefix,
      Format: req.body.Format,
      Active: req.body.Active,
      TenantId: req.body.TenantId,
      CreatedOn: new Date(),
      CreatedBy: 'from_token', // Get ths value from Bearer Token
    }

    transactiontypeconfig
      .create(ttc, username)
      .then((ttcResp) => {
        logger.loggerHelper(
          tenantId,
          username,
          'TransactionTypeConfig_create',
          logger.logType.debug,
          `Record created for Id: ${ttcResp.Id}`
        )
        res.send(ttcResp)
      })
      .catch((err) => {
        if (err.includes('Duplicate entry')) {
          logger.loggerHelper(
            tenantId,
            username,
            'TransactionTypeConfig_create',
            logger.logType.error,
            `Duplicate record found for counter: ${ttc.StartCounterNo}, Error: ${err}`
          )
          return res.sendStatus(409)
        }
        logger.loggerHelper(
          tenantId,
          username,
          'TransactionTypeConfig_create',
          logger.logType.error,
          `Error for record counter: ${ttc.StartCounterNo}, Error: ${err}`
        )
        res.sendStatus(500).send()
      })
  }
}
