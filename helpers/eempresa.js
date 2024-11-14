module.exports = {
    eEmpresa: function(req,res,next){
        if(req.isAuthenticated() && (req.user.tipo == 2 || req.user.tipo == 1)){

            return next() 
        }

        req.flash('error_msg',"Voce deve estar logado como uma Empresa para entar aqui")
        res.redirect('/')
    }
}