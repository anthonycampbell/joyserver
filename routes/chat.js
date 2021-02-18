const user = require('../models/user');
const chat = require('../models/chat');
const message = require('../models/message');
const validator = require('express-validator');
const { set } = require('../app');

module.exports = function(wss){
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var Message = require('../models/message');
    var User = require('../models/user');
    var Chat = require ('../models/chat');
    var cookie = require('cookie');
    var jwt = require('jsonwebtoken');
    var async = require('async');
    var chatRooms = {}

    wss.on('connection', function connection(ws, req) {
        ws.on('message', (msg) => {
            let hope = cookie.parse(req.headers.cookie);
            let data = JSON.parse(msg);
            jwt.verify(hope['jwt'], 'secret', function(err, decoded){
                switch(data.type){
                    case 'newChat': 
                        let friend = data.friend;
                        async.waterfall([
                            function(cb) {
                                Chat.findOne({ $or: [{participants: [decoded.id, friend]}, {participants: [friend, decoded.id]}] })
                                .exec(function(err, chat){
                                    if (!chat) {
                                        let newChat = new Chat;
                                        newChat.participants.push(decoded.id);
                                        newChat.participants.push(friend);
                                        newChat.save((err, chat) => {
                                            cb(null, chat.id);
                                        });
                                    } else {
                                        cb(null, chat.id);
                                    }
                                });
                            }, 
                            function(c, cb){
                                Chat.findById(c).exec(function(err, chat){
                                    if(chatRooms[c]){
                                        let chatters = chatRooms[c];
                                        chatters.push(ws);
                                        chatters = [... new Set(chatters)];
                                        chatRooms[cb] = chatters;
                                    } else {
                                        chatRooms[c] = [ws];
                                    }
                                    cb(null, chat);
                                });
                            }], (err, chat) => {
                                let response = {type: 'chat', id: chat.id, messages: chat.messages};
                                chatRooms[chat.id].map( ws => {
                                    ws.send(JSON.stringify(response));
                                });
                        });
                        break;
                    case 'message':
                        async.waterfall([
                            function(cb){
                                let newMessage = new Message;
                                newMessage.writer = decoded.id;
                                newMessage.data = data.message;
                                newMessage.save(function(err, msg){
                                    if (err){
                                        console.log(err);
                                        console.log('msg', data.message);
                                        return
                                    }
                                    cb(null, newMessage);
                                });
                            },
                            function(newMessage, cb){
                                Chat.findByIdAndUpdate(data.chat, {$push: {messages: newMessage.id} }, (err) => {
                                    if (err){
                                        console.log(err);
                                        return;
                                    }
                                    cb(null, newMessage);
                                });
                            }], (err, newMessage) => {
                                let response = JSON.stringify({type: 'newMessage', newMessage: newMessage});
                                chatRooms[data.chat].map( ws => {
                                    ws.send(response)
                                });
                            }); 
                }
            });
        });
    });

    router.post('/', function(req, res, next){
        passport.authenticate('jwt', {session: false}, function(err, user, info){
            async.waterfall([
                function(cb){
                    Chat.findOne({ 
                        $or: 
                            [{participants: [user.id, req.body.friend]}, 
                            {participants: [req.body.friend, user.id]}] })
                    .exec(function(err, chat){ 
                        cb(null, chat.messages);
                    });
                },
                function(messages, cb){
                    async.map(messages, 
                        function(m , cb){
                            Message.findById(m)
                            .exec(function(err, mes){
                                cb(null, mes);
                            });
                        }, (err, results) => {
                            cb(null, results);
                        }
                    );
                }], (err, result) => {
                    res.json({messages: result});
                });
        })(req, res, next);
    });
    
    return router;
}