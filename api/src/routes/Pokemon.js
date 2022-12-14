const { Router } = require('express');
//importamos las funciones del controller
const { getAll, getId, getName, postCreate } = require('../controllers/Pokemon');




const router = Router()

//GET
router.get('/get', getAll)
router.get('/get/:id', getId)
router.get('/get/get?Name', getName) //no estoy segura

//POST
router.post('/create', postCreate)

module.exports = router;