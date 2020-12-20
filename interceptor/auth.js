const jwt = require('jsonwebtoken');

function verifyTokenIdentifyUser(req, res, next) {
    try {
        const authHeader = req.get('authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if(token) {
                jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
                    if (error) {
                        if(error.name === 'TokenExpiredError') {
                            res.status(498);
                            res.json({
                                error: 'TokenExpiredError'
                            });
                            next();
                        }
                        next();
                    }
                    req.user = user
                    next();
                });
            } else {
                next();
            }
        } else {
            console.log('no header');
            next();
        }
    } catch(error) {
        next(error);
    }
}

function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        const error = new Error('Not Authorized');
        res.status(401).json();
        next(error);
    }
}

module.exports = {
    verifyTokenIdentifyUser,
    isLoggedIn,
};