const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token)
        const decoded = jwt.verify(token, 'secretkey');
        console.log(decoded)
        console.log('user---', decoded.userId)
        const user = await User.findByPk(decoded.userId);

        req.user = user;
        next()

    } catch (err) {
        console.log(err)
        return res.status(401).json({ success: false })
    }
}
module.exports = {
    authenticate: authenticate
}