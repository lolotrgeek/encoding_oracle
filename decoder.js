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

function reverse_formatArrayObjects(array) {
    const keys = Object.keys(array[0]);
    const reversedKeys = keys.reverse();
    return array.map(obj => {
        const reversedObj = {};
        for (let key of reversedKeys) {
            reversedObj[key] = obj[key];
        }
        return reversedObj;
    });
}


function reverse_arrayNormalizer(array) {

}


function undo_objectNormalizer(values) {
    return unflattenObject(values)
}

function denormalize(json) {
    if (Array.isArray(json)) {
        return reverse_arrayNormalizer(reverse_formatArrayObjects(json));
    } else {
        return reverse_flattenObject(reverse_objectNormalizer(json));
    }
}

function decode(normalized, mean, std) {
    const denormalized = normalized.mul(std).add(mean);
    return denormalized.arraySync();
}


module.exports = { reverse_normalize, reverse_arrayNormalizer,reverse_formatArrayObjects,  reverse_objectNormalizer, reverse_flattenObject, reverse_len, decode}