const statusCodes = require('../config/statusCodes.js')

const kcAuthvalidatorMiddleware = async (req, res, next) => {
  const authorizerval = require('../utils/authorizervalidator.js')
  const result = await authorizerval.authorization(req, res, next)

  if (!result) {
    return res.status(statusCodes.HTTP_STATUS_UNAUTHORIZED).send()
  }

  next()
}

module.exports = kcAuthvalidatorMiddleware
