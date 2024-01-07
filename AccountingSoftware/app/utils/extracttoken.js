exports.decodeToken = (req) => {
    let tenantId = req.kauth.grant.access_token.content.tenant; // Fetch Tenant Id from Bearer Token
    let username = req.kauth.grant.access_token.content.preferred_username; // Fetch preferred_username from Bearer Token
    let tenantscope = req.kauth.grant.access_token.content.tenantscope; // Fetch tenantscope from Bearer Token

    return decodedToken = {
        'tenantId': tenantId,
        'username': username,
        'tenantscope': tenantscope
    }
}
