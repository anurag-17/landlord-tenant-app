require("dotenv").config({ path: "./.env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const passport = require('passport');
const User = require("./models/User");
const OAuth2Strategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const socketModule = require('./utils/socketio');
// Connect Database
connectDB();

const app = express();


const corsOptions = {
  origin: [
  "http://localhost:3000",
  "*"
],
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser('secret'));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// set-up-passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth
passport.use(
  new OAuth2Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"/auth/google/callback",
      scope:["profile","email"]
  },
  async(accessToken,refreshToken,profile,done)=>{

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
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

// Initial Facebook oauth Login
app.get('/auth/facebook', passport.authenticate('facebook',{scope:['public_profile', 'email']}));

// Google Authenticate Callback
app.get("/auth/google/callback", passport.authenticate("google",{
  successRedirect:"http://localhost:3000/admin/admin-dashboard",
  failureRedirect:"http://localhost:3000/login"
}));

// Facebook Authenticate Callback
app.get("/auth/facebook/callback", passport.authenticate("facebook",{
    successRedirect: 'http://localhost:3000/admin/admin-dashboard',
    failureRedirect: 'http://localhost:3000/login'
}));

app.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});

// Backend API is Running Msg 
app.get("/", (req, res) => {
  res.send("API is running..");
});

// Auth and User 
app.use("/api/auth", require("./routes/auth"));

app.use("/api/listing", require("./routes/propertyRoute"));
app.use("/api/preference", require("./routes/preferenceRoute"))
app.use("/api/category", require("./routes/category"))

app.use("/api/message", require("./routes/message"));

app.use("/api/auth/upload", require("./routes/auth"));

if (process.env.NODE_ENV === "dev") {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Define route to serve React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// Error Handler 
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
socketModule.init(server);
// DB error handler
process.on("unhandledRejection", (err, promise) => {
  console.log(`Log Error: ${err}`);
  server.close(() => process.exit(1));
});
