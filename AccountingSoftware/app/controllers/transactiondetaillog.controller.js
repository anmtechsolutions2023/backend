const transactiondetaillogmodel = require('../models/transactiondetaillog.model')
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

    const findById = await transactiondetaillogmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiondetaillog.application.update
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactiondetaillog.notFound'),
      })
    }

    const updatedReq = {
      Id: findById[0].Id,
      AccountTypeBaseId: helper.updateFieldValue(
        findById,
        req.body.AccountTypeBaseId
      ),
      UserId: helper.updateFieldValue(findById, req.body.UserId),
      Description: helper.updateFieldValue(findById, req.body.Description),
      BranchDetailId: helper.updateFieldValue(
        findById,
        req.body.BranchDetailId
      ),
      CF1: helper.updateFieldValue(findById, req.body.CF1),
      CF2: helper.updateFieldValue(findById, req.body.CF2),
      CF3: helper.updateFieldValue(findById, req.body.CF3),
      CF4: helper.updateFieldValue(findById, req.body.CF4),
      Active: helper.updateFieldValue(findById, req.body.Active),
      TenantId: tenantId,
      UpdatedOn: new Date(),
      UpdatedBy: username,
    }

    return res
      .status(await transactiondetaillogmodel.update(updatedReq, username))
      .send(i18n.__('messages.success.update'))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiondetaillog.internalServerError',
      res
    )
  }
}

exports.delete = async (req, res) => {
  try {
    const { tenantId, username } = req

    const findById = await transactiondetaillogmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiondetaillog.application.delete
    )

    if (findById === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactiondetaillog.notFound'),
      })
    }

    await transactiondetaillogmodel.deleteById(
      req.params.id,
      tenantId,
      username
    )

    return res.status(statusCodes.HTTP_STATUS_NO_CONTENT).send()
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiondetaillog.internalServerError',
      res
    )
  }
}

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

    const resp = await transactiondetaillogmodel.searchByParam(
      tenantId,
      username,
      params
    )

    if (resp === statusCodes.HTTP_STATUS_BAD_REQUEST) {
      return res.status(statusCodes.HTTP_STATUS_BAD_REQUEST).send({
        message: i18n.__(
          'messages.modules.transactiondetaillog.queryParamNotSupported'
        ),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiondetaillog.internalServerError',
      res
    )
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const { tenantId, username } = req

    return res
      .status(statusCodes.HTTP_STATUS_OK)
      .send(
        translateResponse(
          await transactiondetaillogmodel.getAll(tenantId, username)
        )
      )
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiondetaillog.internalServerError',
      res
    )
  }
}

function translateResponse(respObj) {
  let respDetail = []
  respObj.map((resp) => {
    let respObject = {
      Id: resp.Id,
      AccountTypeBaseId: resp.AccountTypeBaseId,
      UserId: resp.UserId,
      TransactionDateTime: resp.TransactionDateTime,
      Description: resp.Description,
      BranchDetailId: resp.BranchDetailId,
      CF1: resp.CF1,
      CF2: resp.CF2,
      CF3: resp.CF3,
      CF4: resp.CF4,
      TenantId: resp.TenantId,
      Active: resp.Active,
      CreatedOn: resp.CreatedOn,
      CreatedBy: resp.CreatedBy,
      UpdatedOn: resp.UpdatedOn,
      UpdatedBy: resp.UpdatedBy,
    }

    let accounttypebaseObject = {
      Id: resp.AccountTypeBaseId,
      Name: resp.AccountTypeBaseName,
      Active: resp.AccountTypeBaseActive,
    }

    let branchdetailObject = {
      Id: resp.BranchDetailId,
      OrganizationDetailId: resp.BranchDetailOrganizationDetail,
      ContactDetailId: resp.BranchDetailContactDetailId,
      AddressDetailId: resp.BranchDetailAddressDetailId,
      TransactionTypeConfigId: resp.BranchDetailTransactionTypeConfigId,
      BranchName: resp.BranchDetailBranchName,
      TINNo: resp.BranchDetailTINNo,
      GSTIN: resp.BranchDetailGSTIN,
      PAN: resp.BranchDetailPAN,
      CF1: resp.BranchDetailCF1,
      CF2: resp.BranchDetailCF2,
      CF3: resp.BranchDetailCF3,
      CF4: resp.BranchDetailCF4,
      Active: resp.BranchDetailActive,
    }

    respObject.accounttypebaseObject = accounttypebaseObject
    respObject.branchdetailObject = branchdetailObject

    respDetail.push(respObject)
  })
  return respDetail
}

exports.fetchById = async (req, res) => {
  try {
    const { tenantId, username } = req

    const resp = await transactiondetaillogmodel.findById(
      req.params.id,
      tenantId,
      username,
      moduleNames.transactiondetaillog.application.fetchById
    )

    if (resp === statusCodes.HTTP_STATUS_NOT_FOUND) {
      return res.status(statusCodes.HTTP_STATUS_NOT_FOUND).send({
        message: i18n.__('messages.modules.transactiondetaillog.notFound'),
      })
    }

    return res.status(statusCodes.HTTP_STATUS_OK).send(translateResponse(resp))
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiondetaillog.internalServerError',
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
      AccountTypeBaseId: req.body.AccountTypeBaseId,
      UserId: req.body.UserId,
      TransactionDateTime: new Date(),
      Description: req.body.Description,
      BranchDetailId: req.body.BranchDetailId,
      CF1: req.body.CF1,
      CF2: req.body.CF2,
      CF3: req.body.CF3,
      CF4: req.body.CF4,
      Active: req.body.Active,
      TenantId: tenantId,
      CreatedOn: new Date(),
      CreatedBy: username,
    }

    const resp = await transactiondetaillogmodel.create(reqModel, username)
    return res.status(statusCodes.HTTP_STATUS_CREATED).send(resp)
  } catch (err) {
    return commonControllerErrorHandler.commonControllerErrorHandler(
      err,
      'messages.modules.transactiondetaillog.internalServerError',
      res
    )
  }
}
