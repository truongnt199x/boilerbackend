module.exports = (app,passport) => {
    app.post('/signup', passport.authenticate('local-signup'),(req,res) => {
        res.status(200).json({"success":true});
    });

    app.post('/login',passport.authenticate('local-login'),(req,res) => {
        res.status(200).json({"success":true});
    });

    app.get('/auth/facebook',passport.authenticate('facebook',{
        scope : ['email']
    }));

    app.get('/auth/facebook/callback',passport.authenticate('facebook'),(req,res) => {
        res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user));
    });

    app.get('/logout',(req,res) => {
        req.logout();
        res.json(req.user);
    });

    app.get('/auth/google',passport.authenticate('google',{scope:['email']}));

    app.get('/auth/google/callback',passport.authenticate('google'),(req,res) => {
        res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user));
    });
};

