const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    // 'Bearer asdghoaidhga' token is separated by space, we want 2nd part
    try {
        const token = req.header.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'test_secret_key');
        req.userData = {email: decodedToken.email, userId: decodedToken.userId}
        next();
    } catch (e) {
        res.status(401).json({
            message: 'You are not authenticated!'
        })
    }
}
