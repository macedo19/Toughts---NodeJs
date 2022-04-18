// requires importantes para o desenvolvimento
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

// Express
const app = express()

// Banco
const conn = require('./db/conn')

//Models
const Tought = require('./models/Tought')
const User = require('./models/User')


// Routes
const toughtsRoutes = require('../toughts/routes/toughtsRoutes')
const authRoutes = require('../toughts/routes/authRoutes')

// Controller
const ToughtsController = require('./controllers/ToughtsController')

// Handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')



// Config para obter os dados do body em Json
// ------------------------------------------------------
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())
// -----------------------------------------------


// Session middleware
app.use(
    session({
        name: "session", //nome da session
        secret: "nosso_secret", //secret para deixar mais seguro
        resave: false, //se cair a sessao ele ira ser desconectado
        saveUninitialized: false, //
        store: new FileStore({ //Aonde ela sera salva
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'), // diretorio temp seria o sessions, aqui é o caminho para salvar arquivos de sessao
        }),
        cookie: {
            secure: false, //
            maxAge: 360000, // tempo que ele dura é equivalente de 1 dia
            expires: new Date(Date.now() + 360000), //forçar expiração de 1 dia
            httpOnly: true //certificado de segurança, para poder utilizar o cookies (Usado em http pq a segurança do https é maior)
        }
    })
)

// flash messages -> messages de status do sistema (quando ocorre alterações no banco).
app.use(flash())

//Diretorios publicos para usar no sistema ... (Img, js, css)
app.use(express.static('public'))

// set session
app.use((req, res, next) => {
    if(req.session.userid){
        //se tiver sessao ira mandar os dados dele (se usuario nao estiver logado não entra no if)
        res.locals.session = req.session //caso usuário tenha sessao ira ser salvo os dados e mandar em todas as req de respostas
    }

    next()
})

// Routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtsController.showToughts)

// Sincronização com banco
conn.sync().then(()=> {
    app.listen(3000)
}).catch((err) => console.log(err))

// Resetar tabela (Limpeza)
// conn.sync({force: true}).then(()=> {
//     app.listen(3000)
// }).catch((err) => console.log(err))