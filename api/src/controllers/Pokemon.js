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


//Request all the pokemons from API

const getAll = async(req, res, next) => {

    let pokeLimit = 40; 
    try {
    //pedido a la api
        const pokeRequest = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pokeLimit}`)

    //pedido a la db
        const pokeRequestDb = await Pokemon.findAll({include:Type})

        if(pokeRequest || pokeRequestDb){
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

            let mixApiDb = [...pokElements, ...pokeRequestDb]

            res.send(mixApiDb)

            //res.send(pokElements) //me muestra la data traida de la api
            //res.send(pokeRequest.data) //me muestra toda la data

        }else{
            res.json({message: "Error, something went wrong"})

        }
    } catch (error) {
        next(error)
    }
}

//Pokemon ID request from API
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

//Pokemon ID request from DB
const getPokemonByIdDb = async(pokemonId)=>{
    try {
        const findPokeDb = await Pokemon.findOne({
            where: {id: pokemonId},
            include: Type, 
        })
        return findPokeDb
    } catch (error) {
        next(error)
    }
}

// Pokemon NAME request from API
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

//Pokemon NAME request from DB
const getPokemonByNameDb = async(pokemonName)=>{
    try {
        const findPokNameDb = await Pokemon.findOne({
            where: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('pokemon.name')), //con sequelize llama a la columna especificada, con minuscula
                Sequelize.fn('lower', pokemonName)
            ),
            include: {
                attributes: ["name"],
                model: Type,
            }
        })
        return findPokNameDb;
    } catch (error) {
        next(error)
    }
}

// Create a new pokemon
const postCreate = async(req, res, next) => {
// console.log(req.body)
    try {
        const { name, type, life, attack, defense, speed, height, weight, image } = req.body
        await Pokemon.create({name, type, life, attack, defense, speed, height, weight, image})
        res.send("Pokemon created correctly")
    } catch (error) {
        res.status(400).send({error: error.message})
    }
}

// Pokemon TYPE request from API
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
    getType,
    getPokemonByIdDb,
    getPokemonByNameDb,

}


