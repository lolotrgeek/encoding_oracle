const { EncodeJson } = require("./main")

const inputJson = [
    { "foo": { "a": 1, "b": 2 } },
    { "bar": [3, 4, 5] },
    { "baz": "hello world" },
    { "foobar": "hello world" },
]


const flattenedAndEncoded = EncodeJson(inputJson)
console.log(flattenedAndEncoded)
console.log(flattenedAndEncoded.toString())

const textual = [
    { stock: 933, sold: 352, price: 0.95, category: 'drinks', id: 40 },
    { stock: 154, sold: 103, price: 5.20, category: 'foods', id: 67 },
    { stock: 23, sold: 5, price: 121.30, category: 'electronics', id: 150 },
]

const encodedTextual = EncodeJson(textual)
console.log(encodedTextual.toString())
