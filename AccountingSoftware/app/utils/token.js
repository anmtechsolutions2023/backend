const jwt = require("jsonwebtoken");
const kcConfig = require('../config/kcconfig');

exports.Token = (req) => {

    //Get Auth header value  
    const bearerHearder = req.headers['authorization'];
    const secret = kcConfig.client_secret;

    // console.log("secret:" + secret);
    // console.log("bearerHearder:" + bearerHearder);

    if (typeof bearerHearder != 'undefined') {
        //split at the space  
        const bearer = bearerHearder.split(' ');
        //Get the token from array  
        const bearerToken = bearer[1];
        // set the token  
        // req.token = bearerToken;
        //Next middleware  
        // next();

        // console.log("bearerToken:" + bearerToken);

        // Below is working code
        try {
            const decoded = jwt.decode(bearerToken, secret);
            // console.log("decoded" + JSON.stringify(decoded));
            return decoded;
        } catch (error) {
            console.log("Token validator: " + error)
        }
    }


}  