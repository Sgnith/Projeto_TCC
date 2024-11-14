module.exports = {
    nlogged: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }

        req.flash('error_msg',"Voce deve estar logado para entar aqui")
        res.redirect('/')
    }
}