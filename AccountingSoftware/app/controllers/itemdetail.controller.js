const itemdetailmodel = require('../models/itemdetail.model')
const helper = require('../utils/helper')
const moduleNames = require('../config/modulenames')
const decodeToken = require('../utils/extracttoken')
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

    const findById = await itemdetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.itemdetail.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.itemdetail.notFound'),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      Type: helper.isEmpty(req.body.Type) ? findById[0].Type : req.body.Type,
      HSNCode: helper.isEmpty(req.body.HSNCode)
        ? findById[0].HSNCode
        : req.body.HSNCode,
      SKU: helper.isEmpty(req.body.SKU) ? findById[0].SKU : req.body.SKU,
      BatchDetailId: helper.isEmpty(req.body.BatchDetailId)
        ? findById[0].BatchDetailId
        : req.body.BatchDetailId,
      CategoryId: helper.isEmpty(req.body.CategoryId)
        ? findById[0].CategoryId
        : req.body.CategoryId,
      Description: helper.isEmpty(req.body.Description)
        ? findById[0].Description
        : req.body.Description,
      Active: helper.isEmpty(req.body.Active)
        ? findById[0].Active
        : req.body.Active,
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await itemdetailmodel.update(updatedReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.itemdetail.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await itemdetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.itemdetail.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.itemdetail.notFound'),
      })
    }

    await itemdetailmodel.deleteById(req.params.id, tenantId, username)
    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.itemdetail.internalServerError',
      res
    )
  }
}

// exports.search = (req, res) => {
//   var decodedToken = decodeToken.decodeToken(req)

//   let tenantId = decodedToken.tenantId
//   let username = decodedToken.username

//   var params = queryParams.getQueryParams(req.query)

//   var queryParamName = params['QueryParamName']
//   var queryParamValue = params['QueryParamValue']

//   if (helper.isEmpty(queryParamName) || helper.isEmpty(queryParamValue)) {
//     return res.status(400).send({
//       message: 'query param not supported!',
//     })
//   }

//   itemdetailmodel
//     .searchByParam(tenantId, username, params)
//     .then((resp) => {
//       res.status(200).send(translateResponse(resp))
//     })
//     .catch((errCode) => {
//       if (errCode === 400) {
//         return res.status(400).send({
//           message: 'query param not supported!',
//         })
//       }
//       res.sendStatus(500).send()
//     })
// }

exports.search = async (req, res) => {
  try {
    const { tenantId, username } = req

    const params = queryParams.getQueryParams(req.query)

    const queryParamName = params['QueryParamName']
    const queryParamValue = params['QueryParamValue']

    if (helper.isEmpty(queryParamName) || helper.isEmpty(queryParamValue)) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.modules.contactdetail.queryParamMissing'),
      })
    }

    const resp = await itemdetailmodel.searchByParam(tenantId, username, params)

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__('messages.modules.itemdetail.queryParamNotSupported'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.itemdetail.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(translateResponse(await itemdetailmodel.getAll(tenantId, username)))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.itemdetail.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let respObject = {
      Id: resp.Id,
      Type: resp.Type,
      HSNCode: resp.HSNCode,
      SKU: resp.SKU,
      BatchDetailId: resp.BatchDetailId,
      CategoryId: resp.CategoryId,
      Description: resp.Description,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let batchdetailObject = {
      Id: resp.BatchDetailId,
      BatchNo: resp.BatchDetailBatchNo,
      Barcode: resp.BatchDetailBarcode,
      MfgDate: resp.BatchDetailMfgDate,
      Expdate: resp.BatchDetailExpdate,
      PurchaseDate: resp.BatchDetailPurchaseDate,
      IsNonReturnable: resp.BatchDetailIsNonReturnable,
      CostInfoId: resp.BatchDetailCostInfoId,
      UOMId: resp.BatchDetailUOMId,
      Quantity: resp.BatchDetailQuantity,
      MapProviderLocationMapperId: resp.BatchDetailMapProviderLocationMapperId,
      BranchDetailId: resp.BatchDetailBranchDetailId,
      Active: resp.BranchDetailActive,
    }

    let categorydetail = {
      Id: resp.CategoryDetailId,
      Name: resp.CategoryDetailName,
      Active: resp.CategoryDetailActive,
    }

    respObject.batchdetailObject = batchdetailObject
    respObject.categorydetail = categorydetail

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await itemdetailmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.itemdetail.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.itemdetail.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.itemdetail.internalServerError',
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

    // Create a Record
    const reqModel = {
      Type: req.body.Type,
      HSNCode: req.body.HSNCode,
      SKU: req.body.SKU,
      BatchDetailId: req.body.BatchDetailId,
      CategoryId: req.body.CategoryId,
      Description: req.body.Description,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await itemdetailmodel.create(reqModel, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.itemdetail.internalServerError',
      res
    )
  }
}
