const { EncodeJson } = require("./main");
const big = require("./tests/big.json");
const {decode, reverse_normalize} = require("./decoder");

let encoded = EncodeJson(big)

console.log(encoded.arraySync())

const mean = encoded.mean()
const std = encoded.sub(mean).square().mean().sqrt()


let decoded = decode(encoded, mean, std)
// console.log(decoded)
console.log(reverse_normalize(decoded))