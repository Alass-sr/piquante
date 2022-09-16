const jwt = require('jsonwebtoken');
const log = require("../utils/winston");
const dotenv = require("dotenv");

module.exports = (req, res, next) => {
    try {
        log.info(`auth`);
        const token = req.headers.authorization.split(' ')[1];
        log.info(token);
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        log.info(decodedToken);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valide';
        } else {
            next();
        }
    } catch(error) {
        log.error(error);
        res.status(401).json({ error });
    }
};