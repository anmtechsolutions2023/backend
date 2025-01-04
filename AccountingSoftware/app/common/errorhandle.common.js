const modelscripts = require('../../Scripts/modelscripts')
const statusCodes = require('../config/statusCodes')
const i18n = require('../utils/i18n')

class DatabaseError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

const handleDatabaseError = (err) => {
  switch (err.code) {
    case statusCodes.DB_CONNECTION_REFUSED:
      throw new DatabaseError(
        i18n.__('messages.errors.database.connectionRefused'),
        statusCodes.HTTP_STATUS_SERVICE_UNAVAILABLE
      )
    case statusCodes.DB_ACCESS_DENIED:
      throw new DatabaseError(
        i18n.__('messages.errors.database.accessDenied'),
        statusCodes.HTTP_STATUS_FORBIDDEN
      )
    case statusCodes.DB_NOT_FOUND:
      throw new DatabaseError(
        i18n.__('messages.errors.database.databaseNotFound'),
        statusCodes.HTTP_STATUS_NOT_FOUND
      )
    case statusCodes.DB_DUPLICATE_ENTRY:
      throw new DatabaseError(
        i18n.__('messages.errors.database.duplicateEntry'),
        statusCodes.HTTP_STATUS_CONFLICT
      )
    default:
      throw new DatabaseError(
        i18n.__('messages.errors.general.internalServerError'),
        statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR
      )
  }
}

const commonControllerErrorHandler = (err, errorMessage, res) => {
  if (err instanceof handleDatabaseError.DatabaseError) {
    return res.status(err.statusCode).send({
      message: err.message,
    })
  }

  return res.status(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    message: i18n.__(errorMessage),
  })
}

module.exports = handleDatabaseError
module.exports.DatabaseError = DatabaseError
module.exports = commonControllerErrorHandler
