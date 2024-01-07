let allowedRoles = ["admin", "hr", "user"];
//let clientRoles = ["admin", "hr", "user"];
let clientRoles = ["user", "hr"];

// console.log(`Allowed Roles: ${allowedRoles}`);
// console.log(`Client Roles: ${clientRoles}`);

let found = false;

clientRoles.forEach(cr => {
    allowedRoles.forEach(ar => {
        if (cr === ar) {
            console.log(`${cr}`)
            found = true;
        }
    })
})

console.log(`Is client allowed : ${found}`)