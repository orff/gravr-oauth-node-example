This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport](http://passportjs.org/) to authenticate users via OAuth 2.0 with gravr.  
Use this example as a starting point for your own web applications.

Note that OAuth 2.0 does not define a standard way to represent user profile
information.  We are using passport-oauth2 strategy with the userProfile method to
load and store it in a user object.  Using this method you will have access
to user settings in the ejs file, passed along as req.user in the server.js example.

See the /views/aframe example for usage.

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
$ git clone https://github.com/orff/gravr-oauth-client-example.git
$ cd gravr-oauth-client-example
$ npm install
```

Edit the server.js and set your client_id and client_secret and callback URL.  This should be provided when you sign up for gravr API access.

```bash
$ node server.js
```

Open a web browser and navigate to [http://localhost:3000/](http://localhost:3000/)
to see the example in action.
