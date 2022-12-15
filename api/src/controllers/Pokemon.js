const axios = require('axios')
const { json } = require('body-parser')
const { response } = require('express')
const { Pokemon, Type } = require('../db')
const { Sequelize } = require('sequelize')
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
    getImgAttributes,
} = require('../utils')



// GET https://pokeapi.co/api/v2/pokemon
// GET https://pokeapi.co/api/v2/pokemon/{id}
// GET https://pokeapi.co/api/v2/pokemon/{name}
// GET https://pokeapi.co/api/v2/type


//para obtener los pokemones de la api

const getAll = async(req, res, next) => {

    let pokeLimit = 40; //no sé como establecer acá el límite
    try {
    //pedido a la api
        const pokeRequest = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pokeLimit}`)

        if(pokeRequest){
            let pokElements = await Promise.all(pokeRequest.data.results.map(async element=>{
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

            res.send(pokElements) //me muestra la data traida de la api
            //res.send(pokeRequest.data) //me muestra toda la data

        }else{
            res.json({message: "Error, something went wrong"})

        }
    } catch (error) {
        next(error)
    }
}

//obtener los pokemones de la db
const getPokemonDb = async() => {
    try{
        const pokemonDb = await Pokemon.findAll({include:Type})
        return pokemonDb;
    } catch(error){
        return error;
    }
}

//unir info de Api y DB
const getPokeApiDb = async()=>{ 
    try {
        let pokeApi = await getAll()
        let pokeDb = await getPokemonDb()

        return pokeApi.concat(pokeDb)
    } catch (error) {
        return(error)
    }
}

//traer pokemon por ID desde la api
const getId = async(req, res, next) => {

    try {
        const {pokemonId} = req.params
        //busco los pokemones por ID desde la api
        const pokeId = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)

        if(pokeId){
            let pokId = pokeId
                
                res.send( {
                    id: pokId.data.id,
                    name: pokId.data.name,
                    type: pokId.data.types.map(element => {return (element.type.name)}),
                    life: pokId.data.stats[0].base_stat,
                    attack:pokId.data.stats[1].base_stat,
                    defense:pokId.data.stats[2].base_stat,
                    speed: pokId.data.stats[5].base_stat,
                    height: pokId.data.height,
                    weight: pokId.data.weight, 
                    image: pokId.data.sprites.other.dream_world.front_default,
                })
            
        }else{
            res.json({message: `The id: ${pokemonId} requested doesn't exist`})
        }
    } catch (error) {
        next(error)
    }
}

// [ ] GET /pokemons?name="...":
// Obtener el pokemon que coincida exactamente con el nombre pasado como query parameter (Puede ser de pokeapi o creado por nosotros)
// Si no existe ningún pokemon mostrar un mensaje adecuado
const getName = async(req, res, next) => {
    try {
        const {pokemonName} = req.query
        const pokeName = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)

        if(pokeName){
            let pokName = pokeName

            res.send({
                id: pokName.data.id,
                name: pokName.data.name,
                type: pokName.data.types.map(element => {return (element.type.name)}),
                life: pokName.data.stats[0].base_stat,
                attack:pokName.data.stats[1].base_stat,
                defense:pokName.data.stats[2].base_stat,
                speed: pokName.data.stats[5].base_stat,
                height: pokName.data.height,
                weight: pokName.data.weight, 
                image: pokName.data.sprites.other.dream_world.front_default,
            })
            
        }else{
            res.json({message: `The name: ${pokemonName} requested doesn't exist`})
        }

    } catch (error) {
        next(error)
    }
}

// [ ] POST /pokemons:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de pokemons por body
// Crea un pokemon en la base de datos relacionado con sus tipos.
const postCreate = (req, res, next) => {}


// Obtiene los tipos de pokemon desde la api
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


