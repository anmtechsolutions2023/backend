// We clean this file, as and when progress on code.

const KeycloakAdminClient = require('keycloak-admin-client')
const kcConfig = require('../config/kcconfig')
// const { json } = require('express');
const logger = require('../utils/loggerHelper')
// const decodeToken = require('../utils/extracttoken');
const tokenDecoder = require('../utils/token')
const { log } = require('winston')

// update this method to handle multiple api/ method name
exports.authorization = async (req, res, next) => {
  // Authorization header validation
  if (req.headers.authorization === undefined) {
    logger.loggerHelper(
      'NA',
      'NA',
      `${req.method}-${req.url}`,
      logger.logType.error,
      `Not Authorized - Missing authorization token in header.`
    )
    return false
  }

  // Decode values from Bearer token
  var tokenDetail = tokenDecoder.Token(req)

  // Un-authenticated access token
  if (req.kauth.grant === undefined) {
    if (tokenDetail) {
      logger.loggerHelper(
        tokenDetail.tenant,
        tokenDetail.preferred_username,
        `${req.method}-${req.url}`,
        logger.logType.error,
        `Not Authenticated - Un-authorized bearer token.`
      )
    } else {
      logger.loggerHelper(
        'NotPresent',
        'NotPresent',
        `${req.method}-${req.url}`,
        logger.logType.error,
        `Not Authenticated - Un-authorized bearer token.`
      )
    }
    return false
  }

  var allowedRoles = []

  const credentials = {
    baseUrl: kcConfig.baseUrl,
    grant_type: kcConfig.grant_type,
    client_id: kcConfig.client_id,
    client_secret: kcConfig.client_secret,
    realmName: kcConfig.realmName,
  }

  // console.log(tokenDetail)

  // console.log(`group detail: ${JSON.stringify(group)}`)
  // console.log(`${req.method.toLowerCase()}-${req.url.slice(1).toLowerCase().split("/")[0]}`)

  var groupuserapimapper = `${req.method.toLowerCase()}-${
    req.url.slice(1).toLowerCase().split('/')[0]
  }` // final solution to get Method-APIUrl

  // Get the URL Params
  // Get Param2, which is imp, which may have query params.
  // If Param2 not exists then, no issue,
  // If Param2 exists then, check, it has params (which starts with ?), if yes, then get the substring.
  // once get the substring from param2, append it to main string.
  var param2 = req.url.slice(1).toLowerCase().split('/')[1]

  var charToFind = '?'
  var param2substring
  if (param2 && param2.includes(charToFind)) {
    const indexOfChar = param2.indexOf(charToFind)

    // Check if the character was found
    if (indexOfChar !== -1) {
      // Use substring to get the substring from the start to the specified character
      const substring = param2.substring(0, indexOfChar)
      param2substring = substring
      // console.log(substring)
    }
  }

  if (param2substring) {
    groupuserapimapper = `${groupuserapimapper}-${param2substring}`
  }

  // console.log(`groupuserapimapper: ${groupuserapimapper}`)

  var apiMapperforTenant = `${tokenDetail.tenant}_${groupuserapimapper}`

  // console.log(`apiMapperforTenant: ${apiMapperforTenant}`)
  // console.log(`tokenDetail.tenantscope: ${tokenDetail.tenantscope}`)

  // console.log(`kcConfig.apiMapperforTenant: ${kcConfig.apiScopeMapperGroupId}`)

  var kcAdminClient = await new KeycloakAdminClient(credentials)
  // var group = await kcAdminClient.groups.members.find(credentials.realmName, kcConfig.apiScopeMapperGroupId); // Get the Group Id where API and scope mapper defined
  // Below one is fetching only first 100 records.
  // var group = await kcAdminClient.groups.members.find(
  //   credentials.realmName,
  //   tokenDetail.tenantscope
  // ) // Get the Group Id where API and scope mapper defined
  // // console.log(`Group: ${JSON.stringify(group)}`)

  try {
    var userDetail = await findUserByUsername(
      kcAdminClient,
      credentials.realmName,
      apiMapperforTenant
    )

    // console.log(`User Detail: ${JSON.stringify(userDetail)}`)

    if (!userDetail || userDetail.length === 0) {
      throw new Error('User not found')
    }

    var userGroups = await findUserGroupsByUserId(
      kcAdminClient,
      credentials.realmName,
      userDetail[0].id
    )

    // console.log(`User Group: ${JSON.stringify(userGroups)}`)

    if (!userGroups || userGroups.length === 0) {
      throw new Error('User not associated with any group')
    }

    const isAssociated = userGroups.some(
      (ug) => ug.id === tokenDetail.tenantscope
    )
    if (!isAssociated) {
      throw new Error('User not associated with tenantscope group')
    }
  } catch (error) {
    logger.loggerHelper(
      tokenDetail.tenant,
      tokenDetail.preferred_username,
      req.url,
      logger.logType.error,
      `No API user mapper found, no scope found, Error: ${error}`
    )
    return false
  }

  // // var foundUser = group.find((g) => g.username === groupuserapimapper)
  // var foundUser = group.find((g) => g.username === apiMapperforTenant)

  // if (foundUser === undefined) {
  //   logger.loggerHelper(
  //     tokenDetail.tenant,
  //     tokenDetail.preferred_username,
  //     req.url,
  //     logger.logType.error,
  //     `No API user mapper found, no scope found`
  //   )
  //   return false
  // }

  // console.log(foundUser)

  // var userId = foundUser.id
  // var user = await kcAdminClient.users.find(credentials.realmName, {
  //   userId: userId,
  // })

  // console.log(`User detail: ${JSON.stringify(userDetail)}`)
  // console.log(`User attributes: ${userDetail.attributes}`)

  var user = userDetail[0]

  allowedRoles =
    user.attributes &&
    user.attributes.scopes &&
    user.attributes.scopes[0].split(',').map((role) => role.trim())

  // console.log(`Allowed roles: ${JSON.stringify(allowedRoles)}`)

  const clientDetail =
    req.kauth.grant.access_token.content.resource_access[kcConfig.client_id]

  if (clientDetail === undefined) {
    logger.loggerHelper(
      tokenDetail.tenant,
      tokenDetail.preferred_username,
      `${req.method}-${req.url}`,
      logger.logType.error,
      `Does not have valid scope.`
    )
    return false
  }

  // Get all the roles from Bearer Token
  // const clientRoles = req.kauth.grant.access_token.content.resource_access[kcConfig.client_id].roles;
  const clientRoles = clientDetail.roles

  // console.log(`client role: ${clientRoles}`)

  // let tenantId = req.kauth.grant.access_token.content.tenant;
  // let username = req.kauth.grant.access_token.content.preferred_username;

  let found = false

  clientRoles.forEach((cr) => {
    allowedRoles &&
      allowedRoles.forEach((ar) => {
        if (cr === ar) {
          // console.log(`${cr}`)
          found = true
        }
      })
  })
  // console.log(`Is client allowed : ${found}`)

  // Roles not found from the method allowed list. So this is unauthorized.
  // if (!allowedRoles.some(ar => ar.includes(clientRoles))) {
  if (!found) {
    logger.loggerHelper(
      tokenDetail.tenant,
      tokenDetail.preferred_username,
      `${req.method}-${req.url}`,
      logger.logType.error,
      `Does not have valid scope.`
    )
    return false
  }
  // console.log('scope matched')
  return true
}

async function findUserByUsername(kcAdminClient, realmName, username) {
  return await kcAdminClient.users.find(realmName, {
    username: username,
  })
}

async function findUserGroupsByUserId(kcAdminClient, realmName, userId) {
  return await kcAdminClient.users.groups.find(realmName, userId)
}
