var session = require('express-session');
var Keycloak = require('keycloak-connect');

let _keycloak;

// var keycloakConfig = {
//     "realm": "Animesh",
//     "auth-server-url": "http://localhost:8080/auth/",
//     "ssl-required": "external",
//     "resource": "nodejs-microservice",
//     "verify-token-audience": true,
//     "credentials": {
//         "secret": "1E5kEXGwOHHOTmSs3Me5LNvSVPnsdcDS"
//     },
//     "use-resource-role-mappings": true,
//     "confidential-port": 0,
//     "policy-enforcer": {}
// };


var keycloakConfig = {
    clientId: 'nodejs-microservice',
    // bearerOnly: true,
    serverUrl: 'http://localhost:8080/auth',
    realm: 'Animesh',
    credentials: {
        secret: '1E5kEXGwOHHOTmSs3Me5LNvSVPnsdcDS'
    },
};

function initKeycloak() {
    if (_keycloak) {
        console.log("Trying to init Keycloak again!");
        return _keycloak;
    }
    else {
        console.log("Initializing Keycloak.....");
        var memoryStore = new session.MemoryStore();
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
}

function getKeycloak() {
    if (!_keycloak) {
        console.log('Keycloak has not been initialized. Please called init first.');
    }
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak
};