require("dotenv").config({ path: "/.env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo");
// const next = require('next');
// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const passport = require('passport');
const User = require("./models/User");
const OAuth2Strategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// Connect Database
connectDB();

// const app = express();

// app.prepare().then(() => {
  // connectDB();
  const server = express();
const corsOptions = {
  origin: [
  "http://localhost:3000",
  // "http://100.24.75.181:4000",
  "*"
],
  credentials: true, 
};

server.use(cors(corsOptions));

server.use(express.json());
server.use(cors({ origin: "*" }));
server.use(cookieParser('secret'));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "5mb", extended: true }));
// server.use(
//   session({
//     secret: process.env.SECRET_SESSION,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
//   })
// );

// set-up-passport
server.use(passport.initialize());
server.use(passport.session());

// Google OAuth
passport.use(
  new OAuth2Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"/auth/google/callback",
      scope:["profile","email"]
  },
  async(accessToken,refreshToken,profile,done)=>{
// console.log(":::::::",accessToken);
      try {
          let user = await User.findOne({email: profile.emails[0].value});

          if (!user) {
            user = new User({
              provider_ID: profile.id,
              firstname: profile.name.givenName,
              lastname: profile.name.familyName,
              //   image: profile.photos[0].value,
              email: profile.emails[0].value,
              provider: profile.provider,
            });

            await user.save();
          }

          return done(null,user)
      } catch (error) {
          return done(error,null)
      }
  }
  )
);

// Facebook OAuth
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: "/auth/facebook/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await User.findOne({
        provider_ID: profile.id,
      });
      if (!user) {
        console.log('Adding new facebook user to DB..');
        const user = new User({
          // accountId: profile.id,
          provider_ID: profile.id,
          firstname: profile.displayName,
          provider: profile.provider,
        });
        await user.save();
        // console.log(user);
        return cb(null, profile);
      } else {
        console.log('Facebook User already exist in DB..');
        // console.log(profile);
        return cb(null, profile);
      }
    }
  )
);

passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((user,done)=>{
  done(null,user);
});

// Initial Google oauth Login
server.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

// Initial Facebook oauth Login
server.get('/auth/facebook', passport.authenticate('facebook',{scope:['public_profile', 'email']}));

// Google Authenticate Callback
server.get("/auth/google/callback", passport.authenticate("google",{
  successRedirect:"/user",
  failureRedirect:"/login"
}));

// Facebook Authenticate Callback
server.get("/auth/facebook/callback", passport.authenticate("facebook",{
    successRedirect: '/user',
    failureRedirect: '/login'
}));

server.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

server.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://3.90.234.160:4000");
  });
});


// Auth and User 
server.use("/api/auth", require("./server/routes/auth"));

server.use("/api/auth/upload", require("./server/routes/auth"));

server.get('*', (req, res) => {
  return handle(req, res);
});

// Error Handler 
server.use(errorHandler);

const PORT = process.env.PORT || 4000;

 server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
// DB error handler
// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Log Error: ${err}`);
//   server.close(() => process.exit(1));
// });

// })
