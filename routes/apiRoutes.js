const requireLogin = require('./authMiddleware');

module.exports = (app) => {
    app.get('/user',requireLogin,(req,res) => {
       res.json(req.user);
    })
}