const jwt = require('jsonwebtoken')

function validateToken(req, res, next) {
    //get our token
    const token = req.header('Authorization')

    //check if our token is valid
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.userID = decodedToken.userID
        next()
    } catch (error) {
        res.send("Invalid auth token")
    }


    //if valid token setID and continue to next route


    //if invalid token / no token send back unauhtorized
}

module.exports = validateToken