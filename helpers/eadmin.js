module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated() && req.user.tipo  == 1){

            return next() 
        }

        req.flash('error_msg',"Voce deve estar logado como Administrador para entar aqui")
        res.redirect('/')
    }
}