const axios = require('axios')
const { json } = require('body-parser')
const { response } = require('express')
const { Pokemon, Type } = require('../db')

// GET https://pokeapi.co/api/v2/pokemon
// GET https://pokeapi.co/api/v2/pokemon/{id}
// GET https://pokeapi.co/api/v2/pokemon/{name}
// GET https://pokeapi.co/api/v2/type


//para obtener los personajes tanto de la api como de la DB
const getAll = async(req, res, next) => {

    try {
    //pedido a la api
        const pokeRequest = await axios.get('https://pokeapi.co/api/v2/pokemon')
        
    //pedido a la db
        const pokeDbRequest = await Pokemon.findAll({include: Type})
        if(pokeRequest || pokeDbRequest){
            let pokElements = await Promise.all(pokeRequest.data.results?.map(async element=>{
                let responseData = await getResponse(element.url)
                
                let pokeTypeAttributes = getTypeAttributes(responseData)
                let pokeLifeAttributte = getLifeAttributes(responseData)
                let pokeAttackAttributes = getAttackAttributes(responseData)
                let pokeDefenseAttributes = getDefenseAttributes(responseData)
                let pokeSpeedAttributes = getSpeedAttributes(responseData)
                let pokeHeightAttributes = getHeightAttributes(responseData)
                let pokeWeightAttributes = getWeightAttributes(responseData)
                let pokeImgAttributes = getImgAttributes(responseData)
                
                return {
                    //sólo muestro lo que necesito en el front
                    name: element.name,
                    type: pokeTypeAttributes,
                    life: pokeLifeAttributte,
                    attack:pokeAttackAttributes,
                    defense:pokeDefenseAttributes,
                    speed: pokeSpeedAttributes,
                    height: pokeHeightAttributes,
                    weight: pokeWeightAttributes, 
                    image: pokeImgAttributes,

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

async function getResponse(url){
    let responseData = await axios.get(url)
        .then(response => {
            return response
        })
        .catch(function (error) {
            return(error);
        })
    return responseData
}

function getTypeAttributes(responseData){
    return responseData.data.types.map(element => {
                return (element.type.name)
            })
}

function getImgAttributes(responseData){
    return responseData.data.sprites.other.dream_world.front_default;
}

function getLifeAttributes(responseData){
    return responseData.data.stats[0].base_stat
}

function getAttackAttributes(responseData){
    return responseData.data.stats[1].base_stat
}

function getDefenseAttributes(responseData){
    return responseData.data.stats[2].base_stat
}

function getSpeedAttributes(responseData){
    return responseData.data.stats[5].base_stat        
}

function getHeightAttributes(responseData){
    return responseData.data.height
}

function getWeightAttributes(responseData){
    return responseData.data.weight
}






// async function getTypeAttributes(url){
//     const pokeRequest = await axios.get(url)
//     if(pokeRequest){
//         let types = pokeRequest.data.types.map(element=>{
//            return(element.type.name)
//         })
//        let image = pokeRequest.data.sprites.back_default
//        return(types)
//     }
// }
    
module.exports = {
    getAll,
}
