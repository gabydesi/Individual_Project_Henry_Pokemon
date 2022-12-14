const axios = require('axios')

//métodos para buscar info en la API
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

function getIdAttributes(responseData){
    return responseData.data.id
}

function getTypeAttributes(responseData){
    return responseData.data.types.map(element => {
                return (element.type.name)
            })
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

function getImgAttributes(responseData){
    return responseData.data.sprites.other.dream_world.front_default;
}

module.exports = {
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
}