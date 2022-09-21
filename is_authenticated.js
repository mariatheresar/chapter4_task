const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const authorization = req.headers['Authorization'] || req.headers['authorization']
    let token = ''



    if(authorization == "" || typeof authorization === 'undefined') {
        return res.sendStatus(401)
    }

    try {
        token = authorization.replace('Bearer ', '')
        const isVerified = jwt.verify(token, "SomeSecret", {
            algorithms: "HS256",
        })

        const decodedUserData = jwt.decode(token, {
            json: true
        })

        req.userData = {
            id: decodedUserData.id,
            name: decodedUserData.name
        }
        
    } catch (error) {
        return res.sendStatus(401)
    }


    next()
}

module.exports = isAuthenticated;