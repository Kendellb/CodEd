var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');

var app = express();



app.use(session({
  secret: 'secret', //unsecure change later.
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 3600000}
}))



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var editorRouter = require('./routes/editor');
var instructorRouter = require('./routes/instructor');

//MongoDB connection requirements
var mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://test:test@coded.p7136aw.mongodb.net/?retryWrites=true&w=majority&appName=CodEd";


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/editor', editorRouter);
app.use('/instructor', instructorRouter);

app.post('/login',usersRouter);
app.post('/register',usersRouter);

//connecting to MongoDB
mongoose.connect(uri,{
useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));
 
app.use(express.json());  




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

app.use(cors({
  origin: "localhost:8080",
  credentials: true
}
))

module.exports = app;
