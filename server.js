var express = require('express');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;

var serverBase = 'http://api.gravr.io'

OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
    
    const userProfileURL = serverBase + '/api/profile'

    var authorization = 'Bearer ' + accessToken;
      var headers = {
          'Authorization' : authorization
      };
      this._oauth2._request('GET', userProfileURL, headers, '', '', function(err, body, res) {
        if (err) { return done('failed to fetch user profile', err); }

        try {

          var json = JSON.parse(body);

          //console.log('*** GOT JSON', json);

          var profile = {
            provider: 'gravr',
            id: json.user._id,
            username: json.user.username,
            email: json.user.email,
            hash: json.user.hash,
            metrics: json.metrics,
            preferences: json.preferences,
            _raw: body,
            _json: json
          };

          done(null, profile);
        } catch (e) {
          done(e);
        }
      });
}

passport.use(new OAuth2Strategy({
    authorizationURL: serverBase + '/oauth/authorize',
    tokenURL: serverBase + '/oauth/token',
    clientID: ENV.CLIENT_ID,
    clientSecret: ENV.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/return',
    //state: true // using state currently not working: issue with server?
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/logout',
  function(req, res){
    req.logout();
    res.render('logout');
  });

app.get('/login',
  passport.authenticate('oauth2'));

app.get('/return', 
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.get('/aframe',
  function(req, res){
    res.render('aframe-example', { user: req.user });
  });

app.listen(3000);
