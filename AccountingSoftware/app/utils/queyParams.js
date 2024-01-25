exports.getQueryParams = (routeParams) => {
  var obj = {}

  Object.keys(routeParams).forEach((paramName) => {
    obj[paramName] = routeParams[paramName]
  })

  return obj
}
