const mysqlConnection = require('../../utils/db.js')
const logger = require('../../utils/loggerHelper')
const handleDatabaseError = require('../../common/errorhandle.common')
const i18n = require('../../utils/i18n')

exports.getAll = async (tenantId, username, moduleScript, moduleName) => {
  try {
    const query = moduleScript
    const [res] = await mysqlConnection.query(query, [tenantId])

    logger.loggerHelper(
      tenantId,
      username,
      moduleName,
      logger.logType.debug,
      i18n.__('messages.logger.success')
    )
    return res
  } catch (err) {
    logger.loggerHelper(
      tenantId,
      username,
      moduleName,
      logger.logType.error,
      i18n.__('messages.logger.error', { code: err.code, message: err })
    )

    throw handleDatabaseError.handleDatabaseError(err)
  }
}
