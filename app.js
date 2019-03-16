var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var User = require('./models/user.js');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');


var app = express();
app.use(flash());
//mongoDB setup
mongoose.connect('mongodb+srv://flaws:<password>@cluster0-huyyo.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

// view engine setup
app.use(express.static(__dirname + "/public"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('express-session')({
  secret:"letYourselfBeFlawed",
  resave:false,
  saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
//Express Session setup


//PassportJS setup
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

app.use(function(req,res,next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user; //req.user will be empty if no user is current signed in and useranme if signed in
  next();
});

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//User information passing


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
