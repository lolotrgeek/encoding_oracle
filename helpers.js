const tf = require('@tensorflow/tfjs')
const text2Vec = new TextEncoder()

function flattenObject(obj, parentKey = '') {
    let flattenedObj = {};
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = parentKey ? `${parentKey}:${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(flattenedObj, flattenObject(obj[key], newKey));
        } 
        else if(typeof obj[key] === 'string') {
            flattenedObj[`${newKey}:${obj[key]}`] = 1
        }
        else {
          flattenedObj[newKey] = obj[key];
        }
      }
    }
    return flattenedObj;
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
    let formatted = formatArrayObjects(array)
    if(debug)console.log("formatted", formatted)
    return formatted.map(value => Object.values(flattenObject(value)))
}

function objectNormalizer(object) {
    return Object.values(flattenObject(object))
}

function normalize(json, debug = false) {
    let normalized
    if (Array.isArray(json)) normalized = arrayNormalizer(json, debug)
    else if (typeof json === 'object') normalized = objectNormalizer(json)
    else throw new Error('Invalid input')
    if (normalized.reduce((prev, curr) => prev.length == !curr.length)) throw new Error('Normlization failed: Invalid lengths.')
    if (debug) console.log("normalized lengths", normalized.map(value => value.length))
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

module.exports = { normalize, encode, objectNormalizer, arrayNormalizer, flattenObject, formatArrayObjects }