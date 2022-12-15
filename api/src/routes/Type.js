const {Router} = require('express')
const { getType } = require('../controllers/Pokemon');

const router = Router()

//GET
router.get('/type', getType)

module.exports = router;