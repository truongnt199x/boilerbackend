const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const appConfig = require('./appConfig');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const authRoutes = require('./routes/authRoutes');
const apiRoute = require('./routes/apiRoutes');
require('./services/passport');
mongoose.connect(appConfig.mongoURI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use(session({
    secret:appConfig.sessionSecret,
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({
        url:appConfig.mongoURI,
        ttl:15 * 24 * 60 * 60
    }),
}));
app.use(passport.initialize());
app.use(passport.session());
authRoutes(app,passport);
apiRoute(app);
app.listen(3000,() => {
    console.log("Server is listening in port : 3000");
});