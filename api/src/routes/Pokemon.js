const { Router } = require('express');
//importamos las funciones del controller
const { getAll, getId, getName, postCreate } = require('../controllers/Pokemon');




const router = Router()

//GET
router.get('/', getAll)
router.get('/:pokemonId', getId)
router.get('/?pokemonName', getName) //no estoy segura

//POST
router.post('/create', postCreate)

module.exports = router;