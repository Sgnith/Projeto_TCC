module.exports = {
    logged: function(req,res,next){
        if (req.isAuthenticated()) {
            req.flash('error_msg', "Você já realizou o login");
            res.redirect('/');
        } else {
            return next();
        }
    }
}