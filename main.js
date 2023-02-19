const {normalize, encode, flattenObject } = require('./helpers')

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
        let normalized = normalize(json, debug)
        if(debug) console.log("normalized values", normalized)
        encoded = encode(normalized).arraySync()
    }
    else if (typeof json === 'object') encoded = encode(Object.values(flattenObject(json)))
    else encoded = new Error('Invalid input')
    return encoded
}

module.exports = { EncodeJson }