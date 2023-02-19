const { normalize, encode, objectNormalizer, arrayNormalizer, flattenObject, formatArrayObjects,  } = require('../helpers')


describe('flattenObject', () => {
  test('should flatten an object with no nested objects or arrays', () => {
    const input = { a: 1, b: 2, c: 3 }
    const expectedOutput = { a: 1, b: 2, c: 3 }
    expect(flattenObject(input)).toEqual(expectedOutput)
  })

  test('should flatten an object with nested objects and arrays', () => {
    const input = { a: 1, b: { c: 2, d: [3, 4] } }
    const expectedOutput = { 'a': 1, 'b:c': 2, 'b:d:0': 3, 'b:d:1': 4 }
    expect(flattenObject(input)).toEqual(expectedOutput)
  })

  test('should flatten an object with nested arrays that contain objects', () => {
    const input = { a: [{ b: 1 }, { c: 2 }] }
    const expectedOutput = { 'a:0:b': 1, 'a:1:c': 2 }
    expect(flattenObject(input)).toEqual(expectedOutput)
  })

  test('should flatten an object with string values as keys', () => {
    const input = { 'a:b:c': 1 }
    const expectedOutput = { 'a:b:c': 1 }
    expect(flattenObject(input)).toEqual(expectedOutput)
  })
})

describe('formatArrayObjects', () => {
  test('should format an array of objects with different keys into an array of objects with the same keys', () => {
    const input = [{ a: 1, b: 2 }, { b: 3, c: 4 }]
    const expectedOutput = [{ a: 1, b: 2, c: 0 }, { a: 0, b: 3, c: 4 }]
    expect(formatArrayObjects(input)).toEqual(expectedOutput)
  })
})

describe('arrayNormalizer', () => {
  test('should normalize an array of objects with different keys and nested objects/arrays', () => {
    const input = [{ a: 1, b: { c: [2, 3] } }, { b: { c: [4, 5] }, d: 6 }]
    const expectedOutput = [[1, 2, 3, 0], [0, 4, 5, 6]]
    expect(arrayNormalizer(input)).toEqual(expectedOutput)
  })
})

describe('objectNormalizer', () => {
  it('should return an array of normalized values for a given object', () => {
    const input = { a: { b: 1 }, c: 2 }
    const expectedOutput = [1, 2]

    const output = objectNormalizer(input)

    expect(output).toEqual(expectedOutput)
  })

  // Add more tests here
})
describe('encode', () => {
  it('should return a tensor with mean 0 and standard deviation 1', () => {
    const input = [[1, 2, 3], [4, 5, 6]]
    const expectedOutput = "[[-1.4638501405715942,-0.8783100843429565,-0.29277002811431885],[0.29277002811431885,0.8783100843429565,1.4638501405715942]]"

    const output = JSON.stringify(encode(input).arraySync())

    expect(output).toEqual(expectedOutput)
  })

  // Add more tests here
})

describe('normalize', () => {
  it('should return a normalized array for a given JSON array', () => {
    const input = [{ a: 1, b: 2 }, { b: 3, c: 4 }]
    const expectedOutput = [[1, 2, 0], [0, 3, 4]]

    const output = normalize(input)

    expect(output).toEqual(expectedOutput)
  })

  it('should return a normalized array for a given JSON object', () => {
    const input = { a: 1, b: { c: 2 }, d: [3, 4] }
    const expectedOutput = [1, 2, 3, 4]

    const output = normalize(input)

    expect(output).toEqual(expectedOutput)
  })

  it('should throw an error for invalid inputs', () => {
    const input = 123
    
    expect(() => normalize(input)).toThrow('Invalid input')
  })

  // Add more tests here
})