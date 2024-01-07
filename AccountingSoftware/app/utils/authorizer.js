const KeycloakAdminClient = require('keycloak-admin-client');
const kcConfig = require('../config/kcconfig');

// update this method to handle multiple api/ method name
exports.authorization = async (req) => {
    var allowedRoles = []

    const credentials = {
        baseUrl: kcConfig.baseUrl,
        grant_type: kcConfig.grant_type,
        client_id: kcConfig.client_id,
        client_secret: kcConfig.client_secret,
        realmName: kcConfig.realmName,
    };

    var kcAdminClient = await new KeycloakAdminClient(credentials);
    var group = await kcAdminClient.groups.members.find(credentials.realmName, kcConfig.apiScopeMapperGroupId);
    var user = await kcAdminClient.users.find(credentials.realmName, { userId: group[0].id });
    allowedRoles = user.attributes.scopes[0].split(',');

    // Get all the roles from Bearer Token
    const clientRoles = req.kauth.grant.access_token.content.resource_access[kcConfig.client_id].roles;

    // Roles not found from the method allowed list. So this is unauthorized.
    if (!allowedRoles.some(ar => ar.includes(clientRoles))) {
        return false;
    }

    return true;
}