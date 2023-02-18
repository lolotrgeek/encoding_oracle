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