// Maneira de barrar caso o usuário não esteja com sessao ativa
// É uma proteção

module.exports.checkAuth = function(req, res, next){

    const userId = req.session.userid

    // Barra usuário caso não tenha session
    if(!userId) {
        res.redirect('/login')
    }

    next()

}