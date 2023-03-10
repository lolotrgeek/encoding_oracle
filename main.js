const { normalize, encode, flattenObject } = require('./helpers')

/**
 * Pass any JSON object and this encodes it into a tensor array
 * @param {*} json 
 * @source https://wagenaartje.github.io/neataptic/docs/tutorials/normalization/
 * @todo needs optimization, very inefficient
 * @returns `Tensor` can be converted to array with `.array()` or `.arraySync()`
 */
function EncodeJson(json, debug = false) {
    try {
        let encoded
        if (Array.isArray(json)) {
            let normalized = normalize(json, debug)
            if (debug) console.log("normalized values", normalized)
            encoded = encode(normalized)
        }
        else if (typeof json === 'object') encoded = encode(Object.values(flattenObject(json)))
        else encoded = { error: new Error('Invalid input'), array: () => [new Error('Invalid input')], arraySync: () => [new Error('Invalid input')] }
        return encoded
    } catch (error) {
        return error
    }
}

module.exports = { EncodeJson }