const { Router } = require('express');
//importamos las funciones del controller
const { getAll } = require('../controllers/Pokemon');




const router = Router()

//GET

router.get('/get', getAll)

//POST

module.exports = router;