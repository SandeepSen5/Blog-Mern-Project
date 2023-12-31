const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(500).json({ msg: 'Not Authorised User' })
    }
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                return res.status(403).json({ msg: "Token Expired" })
            } else {
                req.user = data;
                next();
            }
        })
    }
}

module.exports = verifyToken;


