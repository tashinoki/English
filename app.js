
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const session = require('express-session');


const indexRouter = require('./routes/index');
const homeRouter = require('./routes/home');
const profileRouter = require('./routes/profile');
const calendarRouter = require('./routes/calendar');
const logoutRouter = require('./routes/logout');
const signupRouter = require('./routes/signup');
const blogRouter = require('./routes/blog');
const proofRouter = require('./routes/proof');
const graphRouter = require('./routes/graph');
const musicRouter = require('./routes/music');
const testRouter = require('./routes/test');
const test2Router = require('./routes/test2');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'max',
    saveUninitialized: false,
    resave: false,
    unset: 'destroy'
}));



// session check
const sessionCheck = (req, res, next) => {

  if(req.session.user){
    next();
  }
  else{
    res.redirect('/');
  }
};


// ルーティング設定
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/home', sessionCheck, homeRouter);
app.use('/profile', sessionCheck, profileRouter);
app.use('/calendar', sessionCheck, calendarRouter);
app.use('/blog', sessionCheck, blogRouter);
app.use('/logout', sessionCheck, logoutRouter);
app.use('/proof', sessionCheck, proofRouter);
app.use('/graph', sessionCheck, graphRouter);
app.use('/music', sessionCheck, musicRouter);
app.use('/test', testRouter);
app.use('/test2', test2Router);


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
