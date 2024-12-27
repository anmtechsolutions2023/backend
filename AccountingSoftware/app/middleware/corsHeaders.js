// Apply CORS headers
const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header(
    'Access-Control-Allow-Methods',
    'POST, PUT, PATCH, GET, DELETE, OPTIONS'
  )
  next()
}

module.exports = corsMiddleware
