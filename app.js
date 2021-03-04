var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
var app = express();
var WebSocket = require('ws');
var ShareDB = require('sharedb');
var dev_db_url = 'mongodb+srv://anthony:ArchieComics9@cluster0-hh67p.azure.mongodb.net/harry_potter?retryWrites=true&w=majority';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
var smdb = require('sharedb-mongo')(mongoDB, {mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true}});
var cookieSession = require('cookie-session');

var wssChat = new WebSocket.Server({ noServer: true });
app.wssChat = wssChat;

var wssShare = new WebSocket.Server({ noServer: true });
app.wssShare = wssShare;
var backend = new ShareDB({db: smdb});

// mongoose
var mongoose = require('mongoose');
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('trust proxy', 1)

app.use(cookieSession({
  httpOnly: false,
  name: 'session',
  keys: ['key1', 'key2'],
  sameSite: 'none',
  maxAge, 31556926
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// passport
app.use(passport.initialize());
require('./config/passport')(passport);

// cors
var corsOpts = {
  origin: 'https://calm-tundra-99790.herokuapp.com',
  credentials: true,
  allowedHeaders: 'content-type',
  exposedHeaders: 'access-control-allow-origin,access-control-allow-methods,access-control-allow-headers',
  preflightContinue: true
}
app.use(cors(corsOpts));

//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studyGuideRouter = require('./routes/study_guide')(wssShare, backend);
var chatRouter = require('./routes/chat')(wssChat);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/study_guide', studyGuideRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
}); 

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
