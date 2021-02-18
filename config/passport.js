var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');

var opts = {};
opts.jwtFromRequest = function(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
};
opts.secretOrKey = 'secret';

module.exports = passport => {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        User.findOne({_id: jwt_payload.id}, function (err, user) {
            if (err){
                return done(err, false);
            }
            if (user){
                return done(null, user);
            }
            //user doesnt exist
            return done(null, false);
        });
    }));
};