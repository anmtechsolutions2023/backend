const mysqlConnection = require('../../utils/db.js')
const logger = require('../../utils/loggerHelper')
const statusCodes = require('../../config/statusCodes.js')
const handleDatabaseError = require('../../common/errorhandle.common')
const i18n = require('../../utils/i18n')

exports.deleteById = async (
  id,
  tenantId,
  username,
  moduleScript,
  moduleName
) => {
  try {
    const query = moduleScript
    const [res] = await mysqlConnection.query(query, [id, tenantId])

    if (res.affectedRows) {
      logger.loggerHelper(
        tenantId,
        username,
        moduleName,
        logger.logType.debug,
        i18n.__('messages.logger.successDeleteById', {
          id: id,
          affectedRows: res.affectedRows,
        })
      )
      return statusCodes.HTTP_STATUS_NO_CONTENT
    } else {
      console.log('Inside else block')
      logger.loggerHelper(
        tenantId,
        username,
        moduleName,
        logger.logType.debug,
        i18n.__('messages.logger.recordNotFindById', { id: id })
      )
      return statusCodes.HTTP_STATUS_NOT_FOUND
    }
  } catch (err) {
    logger.loggerHelper(
      tenantId,
      username,
      moduleName,
      logger.logType.error,
      i18n.__('messages.logger.errorDeleteById', {
        id: id,
        code: err.code,
        message: err,
      })
    )

    throw handleDatabaseError(err)
  }
}
