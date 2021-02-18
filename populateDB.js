var mongoose = require('mongoose');
var async = require('async');
var Subject = require('./models/subject');
var Entry = require('./models/entry');

var mongoDB = 'mongodb+srv://anthony:ArchieComics9@cluster0-hh67p.azure.mongodb.net/harry_potter?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var subjects = [];
var entries = [];

function createSubject(title, fields, cb){
    var newSubject = new Subject({title: title, fields: fields});
    newSubject.save(function(err){
        if(err){
            cb(err, null);
            return;
        }
        subjects.push(newSubject);
        console.log('subject saved');
        cb(null, newSubject);
    });
}

function createEntry(subject, values, cb){
    var newEntry = new Entry({subject, values});
    newEntry.save(function(err){
        if(err){
            cb(err, null);
            return;
        }
        console.log('entry saved');
        entries.push(newEntry);
        cb(null, newEntry);
    });
}

function createSubjects(cb){
    async.series([
        function(callback){
            createSubject("characters", ["name", "description"], callback);
        },
        function(callback){
            createSubject('spells', ['name', 'description'], callback);
        },
        function(callback){
            createSubject('places', ['name', 'description'], callback);
        },
        function(callback){
            createSubject('familiars', ['name', 'description'], callback);
        }
    ], cb);
}

function createEntries(cb){
    async.parallel([
        function(callback){
            createEntry(subjects[0], ['Professor Flitwick', 'Teaches Charms'], callback);
        },
        function(callback){
            createEntry(subjects[0], ['Bill Weasley', 'Studying in Egypt for Gringotts'], callback);
        },
        function(callback){
            createEntry(subjects[0], ['Charlie Weasley', 'Romania Dragons'], callback);
        },
        function(callback){
            createEntry(subjects[0], ['Madame Hooch', 'Broom Flying Instructor'], callback);
        },
        function(callback){
            createEntry(subjects[0], ['Madame Pomfrey', 'Hogwarts Nurse'], callback);
        }
    ], cb);
}

async.series([
    createSubjects,
    createEntries
], function(err, results){
    if (err){ 
        console.log('FINAL ERROR:' + err);
    } else {
        console.log('entries' + entries); 
    }
    mongoose.connection.close();
});
