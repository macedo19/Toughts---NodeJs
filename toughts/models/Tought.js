const {DataTypes} = require ('sequelize')

const db = require('../db/conn')

// User
const User = require('./User')

// Tabela no banco
const Tought = db.define('Tought', {
    title:{
        type: DataTypes.STRING, // Tipo String
        allowNull: false, // Não aceita valores Null
        require: true //Não aceita valores vazios
    },
})


// RELACIONAMENTO 
// ---------------------------------------------------
// Um pensamento esta relacionado a um usuário
Tought.belongsTo(User)

// Um Usuari tem muitos pensamentos
User.hasMany(Tought)

// --------------------------------------------------

module.exports = Tought