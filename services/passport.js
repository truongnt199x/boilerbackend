const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/User');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const appConfig = require('../appConfig');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    if(user){
        done(null,user)
    }
});


passport.use('local-signup',new LocalStrategy({
    usernameField:"email",
    passwordField:"password"
},
 (email,password,done) => {
    process.nextTick(async () => {
       const checkExistUser = await User.findOne({'local.email':email});
       if(checkExistUser){
           return done(null,false)
       }else{
           const newUser = new User();
           newUser.local.email = email;
           newUser.local.password = newUser.generateHash(password);
           const user = await newUser.save();
           if(user){
               return done(null,user);
           }
       }
    })
}
));

passport.use('local-login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
},
async (email,password,done) => {
    const user = await User.findOne({'local.email':email});
    if(!user){
        return done(null,false);
    }else if(!user.validPassword(password)){
        return done(null,false);
    }else{
        return done(null,user);
    }
}

));

passport.use(new FacebookStrategy({
    clientID : appConfig.facebookAppID,
    clientSecret: appConfig.facebookAppSecret,
    callbackURL:"http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name','picture.type(large)','link']
},
async (token,refreshToken,profile,done) => {
    const checkExistFacebookUser = await User.findOne({'facebook.id': profile.id});
    if(checkExistFacebookUser){
        return done(null,checkExistFacebookUser);
    }else{
     
        const facebookUser = new User();
        facebookUser.facebook.id = profile.id;
        facebookUser.facebook.token = token;
        facebookUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
        facebookUser.facebook.email = profile.emails[0].value;
        facebookUser.facebook.avaURL = profile.photos[0].value;
        const savedFacebookUser = await facebookUser.save();
        if(savedFacebookUser){
            
            return done(null,savedFacebookUser);
        }else{
            return done(null,false);
        }
    }
}

));

passport.use(new GoogleStrategy({
    clientID:appConfig.googleClientID,
    clientSecret:appConfig.googleClientSecret,
    callbackURL:"http://localhost:3000/auth/google/callback",
    profileFields: ['id', 'emails', 'name']
},
async (token,refreshToken,profile,done) => {
    const checkExistGoogleUser = await User.findOne({'google.id':profile.id});
    if(checkExistGoogleUser){
        return done(null,checkExistGoogleUser);
    }else{
        const googleUser = new User();
        googleUser.google.id = profile.id;
        googleUser.google.token = token;
        googleUser.google.name = profile.displayName;
        googleUser.google.email = profile.emails[0].value;
        googleUser.google.avaURL = profile.photos[0].value;
        const savedGoogleUser = await googleUser.save();
        if(savedGoogleUser){
            return done(null,savedGoogleUser);
        }else{
            return done(null,false);
        }
    }
}

));


