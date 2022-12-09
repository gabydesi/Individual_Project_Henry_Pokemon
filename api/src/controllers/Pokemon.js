const axios = require('axios')
const { Pokemon } = require('../db')

// GET https://pokeapi.co/api/v2/pokemon
// GET https://pokeapi.co/api/v2/pokemon/{id}
// GET https://pokeapi.co/api/v2/pokemon/{name}
// GET https://pokeapi.co/api/v2/type


//para obtener los personajes tanto de la api como de la DB
const getAll = async(req, res, next) => {
    //res.send('Estoy en el controller sin problema')

    try {
        const pokeRequest = await axios.get('https://pokeapi.co/api/v2/pokemon')

        if(pokeRequest){
            let pokElements = pokeRequest.data.results.map(element=>{

            let pokeTypes = getTypeAttributes(element.url)
            
                
                return {
                    //sólo muestro lo que necesito en el front
                    name: element.name,
                    type: pokeTypes
                }
            
            })
            //res.send(pokeRequest.data) me muestra toda la data
            res.send(pokElements) 
        }else{
            res.json({message: "Error, something went wrong"})
        }
    } catch (error) {
        next(error)
    }
}

async function getTypeAttributes(url){
    const pokeRequest = await axios.get(url)
    if(pokeRequest){
        let types = pokeRequest.data.types.map(element=>{
           return (element.type.name)
        })
       //let image = pokeRequest.data.sprites.back_default
        console.log(types) 
    }
}


module.exports = {
    getAll,
}
