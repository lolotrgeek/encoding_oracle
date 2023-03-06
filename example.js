const { EncodeJson } = require("./main");
const big = require("./tests/big.json");

let encoded = EncodeJson(big)

console.log(encoded.arraySync())