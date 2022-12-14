const axios = require('axios')
const { json } = require('body-parser')
const { response } = require('express')
const { Pokemon, Type } = require('../db')
const {
    getResponse,
    getIdAttributes,
    getTypeAttributes,
    getLifeAttributes,
    getAttackAttributes,
    getDefenseAttributes,
    getSpeedAttributes,
    getHeightAttributes,
    getWeightAttributes,
    getImgAttributes
} = require('../utils')



// GET https://pokeapi.co/api/v2/pokemon
// GET https://pokeapi.co/api/v2/pokemon/{id}
// GET https://pokeapi.co/api/v2/pokemon/{name}
// GET https://pokeapi.co/api/v2/type


//para obtener los personajes tanto de la api como de la DB
const getAll = async(res, next) => {

    let pokeLimit = 5; //no sé como establecer acá el límite
    try {
    //pedido a la api
        const pokeRequest = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pokeLimit}`)
        
    //pedido a la db
        const pokeDbRequest = await Pokemon.findAll({include: Type})

        if(pokeRequest || pokeDbRequest){
            let pokElements = await Promise.all(pokeRequest.data.results?.map(async element=>{
                let responseData = await getResponse(element.url)
                
                return {
                    //sólo muestro lo que necesito en el front
                    id: getIdAttributes(responseData),
                    name: element.name,
                    type: getTypeAttributes(responseData),
                    life: getLifeAttributes(responseData),
                    attack:getAttackAttributes(responseData),
                    defense:getDefenseAttributes(responseData),
                    speed: getSpeedAttributes(responseData),
                    height: getHeightAttributes(responseData),
                    weight: getWeightAttributes(responseData), 
                    image: getImgAttributes(responseData),
                }
            }))
            //uno los arreglos, el que viene de la api y el de la db
            let pokeUnion = [...pokElements, ...pokeDbRequest]

            //res.send(pokElements) //me muestra la data traida de la api
            //res.send(pokeRequest.data) //me muestra toda la data
            res.send(pokeUnion)
        }else{
            res.json({message: "Error, something went wrong"})

        }
    } catch (error) {
        next(error)
    }
}


// [ ] GET /pokemons/{idPokemon}:
// Obtener el detalle de un pokemon en particular
// Debe traer solo los datos pedidos en la ruta de detalle de pokemon
// Tener en cuenta que tiene que funcionar tanto para un id de un pokemon existente en pokeapi o uno creado por ustedes
const getId = async(req, res, next, id) => {
    let pokeIdRequest = pokeUnion
    let currentPokemon = await pokeIdRequest.find(element=> element.id === id)

    if(currentPokemon) {
        
    }
}

// [ ] GET /pokemons?name="...":
// Obtener el pokemon que coincida exactamente con el nombre pasado como query parameter (Puede ser de pokeapi o creado por nosotros)
// Si no existe ningún pokemon mostrar un mensaje adecuado
const getName = (req, res, next) => {}

// [ ] POST /pokemons:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de pokemons por body
// Crea un pokemon en la base de datos relacionado con sus tipos.
const postCreate = (req, res, next) => {}


// Obtiene los tipos desde la api
const getType = async(req, res, next) => {
    try {
        //pedido de la info a la api
        const pokeTypeRequest = await axios.get('https://pokeapi.co/api/v2/type')

        if(pokeTypeRequest){

            let pokeType = await Promise.all(pokeTypeRequest.data.results.map(async element=>{
            let responseData = await getResponse(element.url)

            return {
                id: getIdAttributes(responseData),
                name: element.name
            }
            })) 
            res.send(pokeType)
            //res.send(pokeTypeRequest.data) //me muestra toda la data
        }else{
            res.json({message: "Error, something went wrong"})
        }
    } catch (error) {
        next(error)
    }
}




    
module.exports = {
    getAll, 
    getId,
    getName,
    postCreate,
    getType
}
