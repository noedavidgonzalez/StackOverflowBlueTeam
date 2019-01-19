require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require("express-session");
const bcrypt       = require("bcrypt");
const passport     = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User         = require("./models/user");
const flash        = require("connect-flash");

mongoose
  // .connect('mongodb://localhost/stackoverflow', {useNewUrlParser: true})
  .connect(`mongodb://superadmin:admin2019@ds161134.mlab.com:61134/stackoverflowdb`)
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "ñkafkdañsflask",
  resave: true,
  saveUninitialized: true
}))

passport.serializeUser((user, callback) =>{
  callback(null, user._id)
})

passport.deserializeUser((id, callback) =>{
  User.findById(id, (err, user) =>{
    if (err) { return callback(err)}
      callback(null, user)
    })
})

passport.use(new LocalStrategy((username, password,next ) =>{
  User.findOne({username}, (err, user) =>{
    if (err) {
      return next(err)
    }
    if(!user){
      return next(null, false, {message: "Usuario incorrecto"})
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, {message: "Contraseña incorrecta"})
    }
    return next(null, user)
  })
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


const index = require('./routes/index');
const authRoutes = require("./routes/auth-routes");
const Private = require("./routes/private")
app.use('/', index);
app.use("/", authRoutes);
app.use("/", Private);


module.exports = app;
