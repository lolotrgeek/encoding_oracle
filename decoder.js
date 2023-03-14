// TOOO: only necessary when we are trying to explain the model

function reverse_len(lst) {
    return lst.map(str => str.length).reverse();
}


function unflattenObject(obj) {
    const nestedObj = {};
    for (let key in obj) {
        const keys = key.split(':');
        let currObj = nestedObj;
        for (let k of keys.slice(0, -1)) {
            if (!(k in currObj)) {
                currObj[k] = {};
            }
            currObj = currObj[k];
        }
        currObj[keys[keys.length - 1]] = obj[key];
    }
    return nestedObj;
}

function unformatArrayObjects(formattedArray) {
    try {
      // Find the set of all keys in the array
      const allKeys = new Set()
      formattedArray.forEach(obj => {
        if (obj && typeof obj === 'object') Object.keys(obj).forEach(key => {
          allKeys.add(key)
        })
      })
      // Create a new array of objects with the same keys
      const unformattedArray = formattedArray.map(obj => {
        const unformattedObj = {}
        if (obj && typeof obj === 'object') {
          allKeys.forEach(key => {
            unformattedObj[key] = obj[key]
          })
        }
        return unformattedObj
      })
  
      return unformattedArray
    } catch (error) {
      return error
    }
  }
  


function arrayDenormalizer(array, debug=false) {
    let unformatted = unformatArrayObjects(array)
    if (debug) console.log("unformatted", unformatted)
    return unformatted.map(value => Object.values(unflattenObject(value)))    
}


function objectDenormalizer(values) {
    return unflattenObject(values)
}

function denormalize(json) {
    if (Array.isArray(json)) return arrayDenormalizer(json)
    else if (typeof json === 'object') return objectDenormalizer(json)
    else return new Error('Invalid input')
}

function decode(normalized, mean, std) {
    const denormalized = normalized.mul(std).add(mean);
    return denormalized.arraySync();
}


module.exports = { reverse_len, decode, denormalize, unflattenObject, unformatArrayObjects, arrayDenormalizer, objectDenormalizer}