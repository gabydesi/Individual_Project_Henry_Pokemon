const { Router } = require('express');
const Pokemon = require('./Pokemon.js')
const Type = require('./Type.js')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/pokemon', Pokemon)
router.use('/type', Type)



module.exports = router;
