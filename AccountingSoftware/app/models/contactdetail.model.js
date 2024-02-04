const { v4: uuidv4 } = require('uuid')
const sql = require('./db.js')
const statuses = require('./statuses.js')
const logger = require('../utils/loggerHelper')
const moduleScripts = require('../../Scripts/modelscripts.js')
const moduleNames = require('../config/modulenames')

exports.delete = (id, tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactdetail.delete

    sql.query(query, [id, tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactdetail.db.delete,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:.' + err)
      }

      if (JSON.stringify(res.affectedRows)) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactdetail.db.delete,
          logger.logType.debug,
          `Deleted record Id: ${id}, affected Rows are: ${res.affectedRows} `
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactdetail.db.delete,
          logger.logType.error,
          ` No Record found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.getAll = (tenantId, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactdetail.fetchAll

    sql.query(query, [tenantId], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactdetail.db.fetchAll,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  getAll.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.contactdetail.db.fetchAll,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.searchByParam = (tenantId, username, queryParams) => {
  let query = null

  return new Promise((resolve, reject) => {
    switch (queryParams.QueryParamName) {
      case 'FirstName':
        query = moduleScripts.contactdetail.searchbyfirstname
        break
      case 'LastName':
        query = moduleScripts.contactdetail.searchbylastname
        break
      default: {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactdetail.db.searchbyname,
          logger.logType.error,
          `Not supported query param.`
        )
        return reject(statuses.Statuses.BadRequest)
      }
    }

    sql.query(query, [tenantId, queryParams.QueryParamValue], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          moduleNames.contactdetail.db.searchbyname,
          logger.logType.error,
          `Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  searchbyname.' + err)
      }

      logger.loggerHelper(
        tenantId,
        username,
        moduleNames.contactdetail.db.searchbyname,
        logger.logType.debug,
        `Success`
      )
      resolve(res)
    })
  })
}

exports.update = (cdReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactdetail.update

    sql.query(
      query,
      [
        cdReq.FirstName,
        cdReq.LastName,
        cdReq.MobileNo,
        cdReq.AltMobileNo,
        cdReq.Landline1,
        cdReq.Landline2,
        cdReq.Ext1,
        cdReq.Ext2,
        cdReq.ContactAddressTypeId,
        cdReq.Active,
        cdReq.UpdatedOn,
        cdReq.UpdatedBy,
        cdReq.Id,
        cdReq.TenantId,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            cdReq.TenantId,
            username,
            moduleNames.contactdetail.db.update,
            logger.logType.error,
            `Error for Id: ${cdReq.Id}, Error code: ${err.code}, Error: ${err}`
          )
          return reject('DB Error, for operation:  update.' + err)
        }

        logger.loggerHelper(
          cdReq.TenantId,
          username,
          moduleNames.contactdetail.db.update,
          logger.logType.debug,
          `Successfully updated Id: ${cdReq.Id}`
        )
        resolve(res)
      }
    )
  })
}

exports.findById = (id, tenantId, username, callerModule) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactdetail.fetchById

    sql.query(query, [tenantId, id], (err, res) => {
      if (err) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.contactdetail.db.fetchById}`,
          logger.logType.error,
          `Error for Id: ${id}, Error Code: ${err.code}, Error: ${err}`
        )
        return reject('DB Error, for operation:  findById.' + err)
      }

      if (res.length) {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.contactdetail.db.fetchById}`,
          logger.logType.debug,
          `Record found for Id: ${id}`
        )
        resolve(res)
      } else {
        logger.loggerHelper(
          tenantId,
          username,
          `${callerModule}--${moduleNames.contactdetail.db.fetchById}`,
          logger.logType.error,
          `Record not found for Id: ${id}`
        )
        resolve(statuses.Statuses.NotFound)
      }
    })
  })
}

exports.create = (cdReq, username) => {
  return new Promise((resolve, reject) => {
    let query = moduleScripts.contactdetail.create
    let cdId = uuidv4()

    sql.query(
      query,
      [
        cdId,
        cdReq.FirstName,
        cdReq.LastName,
        cdReq.MobileNo,
        cdReq.AltMobileNo,
        cdReq.Landline1,
        cdReq.Landline2,
        cdReq.Ext1,
        cdReq.Ext2,
        cdReq.ContactAddressTypeId,
        cdReq.TenantId,
        cdReq.Active,
        cdReq.CreatedOn,
        cdReq.CreatedBy,
      ],
      (err, res) => {
        if (err) {
          logger.loggerHelper(
            cdReq.TenantId,
            username,
            moduleNames.contactdetail.db.create,
            logger.logType.error,
            `Error while creating record for ${cdReq.TaxGroupId}-${cdReq.TaxTypeId}, Error Code: ${err.code} , Error: ${err}`
          )
          return reject(err.code)
        }

        logger.loggerHelper(
          cdReq.TenantId,
          username,
          moduleNames.contactdetail.db.create,
          logger.logType.debug,
          `Successfully created with Id: ${cdId}`
        )
        resolve(cdId)
      }
    )
  })
}
