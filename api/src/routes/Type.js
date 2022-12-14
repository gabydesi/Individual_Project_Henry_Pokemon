const {Router} = require('express')
const { getType } = require('../controllers/Pokemon');

const router = Router()

//GET
router.get('/get', getType)

module.exports = router;