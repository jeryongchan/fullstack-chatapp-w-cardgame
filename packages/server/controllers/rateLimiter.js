const redisClient = require("../redis");

module.exports.rateLimiter =
    (secondsLimit, limitAmount) => async (req, res, next) => {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress.slice(0, 4);
        const [response] = await redisClient
            .multi()
            .incr(ip)
            .expire(ip, secondsLimit)
            .exec();
        
        if (response[1] > limitAmount) {
            res.json({
                loggedIn: false,
                status: "Try again in a minute."
            });
        }
        else next();
    };
