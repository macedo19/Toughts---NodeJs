const express = require('express')
const router = express.Router()
const ToughtsController = require('../controllers/ToughtsController')

//helpers (Middlewares)
const checkAuth = require('../helpers/auth').checkAuth //nome da function ao qual esta importando

// controller
router.get('/add',checkAuth,  ToughtsController.createToughts) //o checkAuth é um parametro de proteção
router.post('/add',checkAuth,  ToughtsController.createToughtsSave) //o checkAuth é um parametro de proteção
router.get('/edit/:id',checkAuth,  ToughtsController.updateToughts) //o checkAuth é um parametro de proteção
router.post('/edit',checkAuth,  ToughtsController.updateToughtsSave) //o checkAuth é um parametro de proteção
router.get('/dashboard',checkAuth,  ToughtsController.dashboard) //o checkAuth é um parametro de proteção
router.post('/remove',checkAuth,  ToughtsController.removeToughts) //o checkAuth é um parametro de proteção
router.get('/',  ToughtsController.showToughts)


module.exports = router