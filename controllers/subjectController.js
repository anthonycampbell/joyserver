const validator = require('express-validator');
var Subject = require('../models/subject.js');
var Entry = require('../models/entry');
var StudyGuide = require('../models/studyGuide')
var User = require('../models/user');
var passport = require('passport');
var async = require('async');

exports.index = function(req, res, next){
    passport.authenticate('jwt', {session: false}, function(err, user, info){
        let studyGuides = [];
        if (err) { return next(err) }
        if (!user) { return res.send({status: 'Logged out'}) }
        async.map(user.studyGuides, function(sg, done){
            StudyGuide.findById( sg ).exec(done);
        }, function (err, results){
            for (let i = 0; i < results.length; i++){
                studyGuides[i] = {title: results[i].title, id: results[i].id}
            }
            res.json({studyGuides: studyGuides});
        });
    })(req, res, next);
}

exports.subject_create = function(req, res, next){
    //res.json({subject: "create"});
    passport.authenticate('jwt', {session: false}, function(err, user, info){
        if (err) { return next(err) }
        if (!user) { return res.send({status: 'Logged out'}) }
        async.waterfall([
            function(cb){
                let newStudyGuide = new StudyGuide();
                newStudyGuide.title = req.body.newStudyGuide;
                newStudyGuide.author = user.id;
                newStudyGuide.save((err, g) => {
                    if (err) {
                        console.log(err);
                        return
                    }
                    cb(null, g);
                });
            }, 
            function(g, cb){
                User.findByIdAndUpdate(
                    user.id,
                    {$push: {studyGuides: g.id }},
                    function(err, d){
                        if (err) { return next(err)}
                        cb(null)
                    }
                );
            }], function(err, results){
                    async.map(user.studyGuides, function(sg, done){
                        StudyGuide.findById( sg ).exec(done);
                    }, function (err, results){
                        res.json({studyGuides: results});
                    });
            });
    })(req, res, next);
}

exports.subject_detail_get = function(req, res, next){
    /*async.parallel({
        subject: function(callback){
            Subject.findById(req.params.id).exec(callback);
        },
        entries: function(callback){
            Entry.find({'subject': req.params.id}).exec(callback);
        }
    }, function(err, results){
        if (err){
            next(err);
        }
        res.json({title: results.subject.title, subject: results.subject, entries: results.entries});
        //res.render('subject_detail', {title: results.subject.title, subject: results.subject, entries: results.entries});
    });*/
    res.json({ yo: 'bro'});
}

exports.subject_detail_post = function (req, res, next) {
    res.json({subject: "detail post"});
    /*validator.body('name', 'name required').trim().isLength({min: 1}),
    validator.sanitize('name').escape(),
    (req, res, next) => {
        const errors = validator.validationResult(req)
        var entry = new Entry({
            
        })
    }*/
}