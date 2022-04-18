// Require do Sequelize
const {Sequelize} = require ('sequelize')

// CONEXÃO COM O BANCO (banco, username, senha, host, dialeto é a linguagem)
const sequelize = new Sequelize('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try{
    // Autenticar no banco a conexão
    sequelize.authenticate()
    console.log('Conexão com sucesso!!')
}catch(erro){
    // Caso ocorra erro apresenta o erro
    console.log(erro)
}

// Exportando o modulo para ser usado dentro do sistema
module.exports = sequelize