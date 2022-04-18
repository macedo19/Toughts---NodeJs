const Tought = require('../models/Tought')
const User = require('../models/User')

// Operacao sequeliza
const { Op} =require('sequelize')

module.exports = class ToughtsController{

    // Renderiza view
    static async showToughts(req, res){

        let search = ''

        // Campo de busca 
        if(req.query.search){
            search = req.query.search
        }

        // Ordenacao
        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        }else{
            order = 'DESC'
        }

        // get toughts
        const toughtsData = await Tought.findAll({
            include: User, //relacionamento
            where: {
                title: {[Op.like]: `%${search}%`} //Operador like
            },
            order: [['createdAt', order]] //Ordenacao
        })

        // dados do array
        const toughts = toughtsData.map((result) => result.get({plain: true}))//metodo plain junta os dois arrays

        // Qtde de  results
        let toughtsQty = toughts.length

        // Qtde de toughts
        if(toughts === 0){
            toughtsQty =false
        }

        // Renderiza
        res.render('toughts/home', {toughts, search, toughtsQty})
    }

    static async dashboard(req, res){

        // user id pela session
        const userId = req.session.userid

        // get dados
        const user = await User.findOne({
            where: {id: userId},
            include: Tought, //relacionamento
            plain: true // dados importantes
        })

        // Check se usuario existe
        if(!user){
            res.redirect('/login')
        }

        // function map trabalha com todos os itens do array
        const toughts = user.Toughts.map((result) => result.dataValues) //aqui eu elimino todos os outros e digo que meu toughts recebe apenas o dataValues

        //validação para tarefaas vazias
        let emptyToughts = false

        // Toughts vazio no banco
        if(toughts.length === 0){
            emptyToughts = true;
        }
    
        // Renderiza
        res.render('toughts/dashboard', {toughts, emptyToughts})
    }

    // Renderiza view
    static createToughts(req, res){
        res.render('toughts/create')
    }

    //Salvando os dados
    static async createToughtsSave(req, res){

        // get dados pensamentps
       const tought = {
           title: req.body.title,
           UserId: req.session.userid
       }

       try{
            //Save pensamento    
            await Tought.create(tought)

            // Mensagem de sucesso
            req.flash('message', 'Pensamento criado com sucesso!')

            // save session
            req.session.save(() => {
                res.redirect('/toughts/dashboard') //redireciona view
            })
        }catch(error){
            console.log('Aconteceu um erro: ' + error)
        }
       
    }

    //Remove pensamento
    static async removeToughts(req, res){
        // Get dados
        const id = req.body.id
        const userId = req.session.userid

        try{

            await Tought.destroy({where: {id: id, UserId: userId}}) //destroy pensamento

            // Mensagem de sucesso
            req.flash('message', 'Pensamento removido com sucesso!')

            // Save session
            req.session.save(() => {
                res.redirect('/toughts/dashboard') // redireciona view
            })

        }catch(error){
            console.log('Aconteceu um erro:' + error)
        }
      

    }


    // Renderizar para editar pensamento
    static async updateToughts(req, res){
        const id = req.params.id

        //Get elemento
        const tought = await Tought.findOne({where: {id: id}, raw: true}) 

        //Renderiza view
        res.render('toughts/edit', {tought})
    }

    // Metodo Update
    static async updateToughtsSave(req, res){

        // get id pelo body
        const id = req.body.id

        // Objeto tought
        const tought = {
            title: req.body.title
        }

        try{

            // update tought
            await Tought.update(tought, {where: {id : id}})

            // Mensagem de sucesso
            req.flash('message', 'Pensamento atualizado com sucesso!')
    
            // Save session
            req.session.save(() => {
                res.redirect('/toughts/dashboard') // redireciona view
            })

        }catch(error){
            console.log('Ocorreu um erro: ' + error)
        }
     
    }
}