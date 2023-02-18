const tf = require('@tensorflow/tfjs')
const text2Vec = new TextEncoder()

const keyIfy = array => {
    return array.map((value, index) => {
        if(Array.isArray(value)) keyIfy(value)
        return { [index]: value}
    })
}

const flattenObject = (obj) => {
    const flattened = {}
    // If the initial object is an array, we may need to keyify any values of nested arrayss
    // if (Array.isArray(obj))  obj = keyIfy(obj)
    
    Object.keys(obj).forEach((key) => {
        const value = obj[key]

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(flattened, flattenObject(value))
        }
        else if (Array.isArray(value)) {
            value.map((arrayValue, index) => {
                if (typeof arrayValue === 'object' && arrayValue !== null) {
                    Object.assign(flattened, flattenObject(arrayValue))
                }
                flattened[key + ":" + index] = arrayValue
            })
        
        } 
        else if( typeof value === 'string') {
            text2Vec.encode(value).forEach((char, index) => {
                flattened[key + ":" + index] = char
            }) 
        }
        else {
            flattened[key] = value
        }
    })

    return flattened
}

function formatArrayObjects(array) {
    // Find the set of all keys in the array
    const allKeys = new Set()
    array.forEach(obj => {
        Object.keys(obj).forEach(key => {
            allKeys.add(key)
        })
    })

    // Create a new array of objects with the same keys
    const formattedArray = array.map(obj => {
        const formattedObj = {}
        allKeys.forEach(key => {
            formattedObj[key] = obj[key] || 0
        })
        return formattedObj
    })

    return formattedArray
}

function arrayNormalizer(array, debug = false) {
    let pre_normalized = array.map(flattenObject)
    console.log("pre_normalized", pre_normalized)
    return formatArrayObjects(pre_normalized).map(value => {
        let flattened = flattenObject(value)
        if(debug) console.log("keys", Object.keys(flattened))
        return Object.values(flattened)
    })
}

function objectNormalizer(object) {
    return Object.values(flattenObject(object))
}

function normalize(json,debug = false) {
    let normalized
    if (Array.isArray(json)) normalized = arrayNormalizer(json)
    else if (typeof json === 'object') normalized = objectNormalizer(json)
    else normalized = new Error('Invalid input')
    if(debug) console.log(normalized.map(value => value.length))
    return normalized
}

function encode(data) {
    const tensor = tf.tensor(data)
    // Calculate the mean and standard deviation of the tensor
    const mean = tensor.mean()
    const std = tensor.sub(mean).square().mean().sqrt()
    const normalized = tensor.sub(mean).div(std)
    return normalized
}

/**
 * Pass any JSON object and this encodes it into a tensor array
 * @param {*} json 
 * @source https://wagenaartje.github.io/neataptic/docs/tutorials/normalization/
 * @todo needs optimization, very inefficient
 * @returns 
 */
function EncodeJson(json, debug = false) {
    let encoded
    if (Array.isArray(json)) {
        let normalized = normalize(json)
        if(debug) console.log(normalized)
        encoded = encode(normalized)
    }
    else if (typeof json === 'object') encoded = encode(Object.values(flattenObject(json)))
    else encoded = new Error('Invalid input')
    return encoded
}

module.exports = { EncodeJson }