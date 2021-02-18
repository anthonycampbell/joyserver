var express = require('express');
var router = express.Router();
var subject_controller = require('../controllers/subjectController');
var passport = require('passport');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var cookie = require('cookie');
var jwt = require('jsonwebtoken');

module.exports = function(wssShare, backend){
    var shareCon = backend.connect();
    wssShare.on('connection', function(ws, req) {
        let hope = cookie.parse(req.headers.cookie);
        jwt.verify(hope['jwt'], 'secret', function(err, decoded){
            var stream = new WebSocketJSONStream(ws);
            backend.listen(stream);
        });
    });
    router.get('/', subject_controller.index);
    router.post('/', subject_controller.subject_create);
    router.get('/:id', function(req, res, next){
        var doc = shareCon.get('new', req.params.id);
        doc.fetch(function(err) {
            if (err) throw err;
            if (doc.type === null) {
                doc.create({ tables: [{ title: null, fields: [], rows: [[]]}]}, function(err){
                    if (err) throw err;
                    res.json({se: 'sir'});
                });
            } else {
                res.json({we: 'gucci'});
            }
        });
    });
    router.post('/subject/:id', subject_controller.subject_detail_post);
    return router;
} 



