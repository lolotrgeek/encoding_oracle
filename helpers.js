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
            else if (typeof obj[key] === 'string') {
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
    try {
        // Find the set of all keys in the array
        const allKeys = new Set()
        array.forEach(obj => {
            if (typeof obj === 'object') Object.keys(obj).forEach(key => {
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
    } catch (error) {
        return error
    }
}

function arrayNormalizer(array, debug = false) {
    try {
        let formatted = formatArrayObjects(array)
        if (debug) console.log("formatted", formatted)
        return formatted.map(value => Object.values(flattenObject(value)))

    } catch (error) {
        return error
    }
}

function objectNormalizer(object) {
    try {
        return Object.values(flattenObject(object))
    } catch (error) {
        return error
    }
}

function normalize(json, debug = false) {
    try {
        let normalized
        if (Array.isArray(json)) normalized = arrayNormalizer(json, debug)
        else if (typeof json === 'object') normalized = objectNormalizer(json)
        else throw new Error('Invalid input')
        if (normalized.reduce((prev, curr) => prev.length == !curr.length)) throw new Error('Normlization failed: Invalid lengths.')
        if (debug) console.log("normalized lengths", normalized.map(value => value.length))
        return normalized
    } catch (error) {
        return error
    }

}

function encode(data) {
    try {
        const tensor = tf.tensor(data)
        // Calculate the mean and standard deviation of the tensor
        const mean = tensor.mean()
        const std = tensor.sub(mean).square().mean().sqrt()
        const normalized = tensor.sub(mean).div(std)
        return normalized
    } catch (error) {
        return error
    }

}

module.exports = { normalize, encode, objectNormalizer, arrayNormalizer, flattenObject, formatArrayObjects }