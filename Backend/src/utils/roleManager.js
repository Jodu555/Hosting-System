const authManager = require('./authManager');

const isPermitted = (user, role) => {
    //TODO: Do there some permission stuff
    return user.UUID == 'a6e7ba88-53eb-4233-8789-691741583b3a';
}

const roleAuthorization = (role) => {
    return authManager.authenticationFull((user) => isPermitted(user, role));
}

module.exports = {
    isPermitted,
    roleAuthorization
}