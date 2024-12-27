const decodeToken = require('../utils/extracttoken')
const i18n = require('../utils/i18n')
const statusCodes = require('../config/statusCodes')
const devSkipAuth = require('../config/dev.skipauth.testing.js')

const authCommonHeaderMiddleware = (req, res, next) => {
  try {
    const decodedToken =
      !devSkipAuth.DevTestingEnabled && decodeToken.decodeToken(req)
    const { tenantId, username } = devSkipAuth.DevTestingEnabled
      ? { tenantId: devSkipAuth.tenantId, username: devSkipAuth.username }
      : decodedToken

    // Attach tenantId and username to the request object
    req.tenantId = tenantId
    req.username = username

    // Get the language from the Accept-Language header
    const lang = req.headers['accept-language'] || 'en'
    i18n.setLocale(lang)

    // Attach lang to the request object
    req.lang = lang

    next()
  } catch (err) {
    return res.status(statusCodes.HTTP_STATUS_UNAUTHORIZED).send({
      message: i18n.__('messages.errors.authentication.invalidCredentials'),
    })
  }
}

module.exports = authCommonHeaderMiddleware
