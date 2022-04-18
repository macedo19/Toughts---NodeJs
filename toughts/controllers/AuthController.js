const User = require('../models/User')

// Criptografar senhar
const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    // CONTROLLER RESPONSAVEL POR TRABALHAR COM TODO O FLUXO DE AUTENTICACAO

    // Apenas renderizar a view
    static login (req, res){
        res.render('auth/login')
    }

    // Login 
    static async loginPost(req, res){
        const {email, password} = req.body

        // busca user
        const user = await User.findOne({where: {email: email}})

        // Valida e-mail
        if(!user){
             //mensagem
             req.flash('message', 'Usuário não encontrado!')
             res.render('auth/login') //A mensagem some depois que renderiza. necessita de um tratamento a parte
 
             return
        }

        // Compara as senhas com bcrypt -> metodo utilizado para descriptografar e comparar
        const passwordMatch = bcrypt.compareSync(password, user.password) //se nao foi iguais retorna false

        // Valida senha
        if(!passwordMatch){
              //mensagem
              req.flash('message', 'Senha inválida')
              res.render('auth/login') //A mensagem some depois que renderiza. necessita de um tratamento a parte
  
              return
        }

        
         // inicializar a session
         req.session.userid = user.id

         req.flash('message', 'Autenticação realizado com sucesso !!')
         
         // Salvando a sessao
         req.session.save(() => {
             res.redirect('/') //Redirecionando
         })


    }

     // Apenas renderizar a view
    static register(req, res){
        res.render('auth/register')
    }
    
    // Registra usuário
    static async registerPost(req,res){

        const {name, email, password, confirmpassword} = req.body

        // validação de password
        if(password != confirmpassword){
            //mensagem
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register') //A mensagem some depois que renderiza. necessita de um tratamento a parte

            return
        }

        // check se user exite
        const checkIfUserExist = await User.findOne({where: {email : email}, raw: true})

        if(checkIfUserExist){
              //mensagem
              req.flash('message', 'O e-mail ja esta em uso!')
              res.render('auth/register') //A mensagem some depois que renderiza. necessita de um tratamento a parte
  
              return
        }

        // create password
        const salt = bcrypt.genSaltSync(10) // cria 10 caracteres randomicos
        const hashedPassWord = bcrypt.hashSync(password, salt) // gera a hash unindo a senha com os caracteres do salt

        // Objeto User
        const user = {
            name,
            email,
            password: hashedPassWord
        }

        try{
            // Salva no banco
            const createUser = await User.create(user)

            // inicializar a session
            req.session.userid = createUser.id

            req.flash('message', 'Cadastro realizado com sucesso !!')
            
            // Salvando a sessao
            req.session.save(() => {
                res.redirect('/') //Redirecionando
            })

        }catch(error){

            console.log(error)
        }
        
    }

    // Logout sistem
    static logout(req, res){
        req.session.destroy() //destroi a sessao
        res.redirect('/login')
    }
}