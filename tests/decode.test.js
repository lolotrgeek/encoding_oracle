const { denormalize, unflattenObject, unformatArrayObjects, arrayDenormalizer, objectDenormalizer} = require("../decoder")

describe("unformatArrayObjects", () => {
  it("should return an empty array when given an empty array", () => {
    const formattedArray = []
    const expectedUnformattedArray = []
    expect(unformatArrayObjects(formattedArray)).toEqual(expectedUnformattedArray)
  })

  it("should return the same array when given an array of objects with the same keys", () => {
    const formattedArray = [
      {key1: 1, key2: 2},
      {key1: 3, key2: 4},
      {key1: 5, key2: 6}
    ]
    const expectedUnformattedArray = [
      {key1: 1, key2: 2},
      {key1: 3, key2: 4},
      {key1: 5, key2: 6}
    ]
    expect(unformatArrayObjects(formattedArray)).toEqual(expectedUnformattedArray)
  })

  it("should return an array with missing keys when given an array of objects with different keys", () => {
    const formattedArray = [
      {key1: 1, key2: 2},
      {key2: 3, key3: 4},
      {key3: 5, key4: 6}
    ]
    const expectedUnformattedArray = [
      {key1: 1, key2: 2, key3: undefined, key4: undefined},
      {key1: undefined, key2: 3, key3: 4, key4: undefined},
      {key1: undefined, key2: undefined, key3: 5, key4: 6}
    ]
    expect(unformatArrayObjects(formattedArray)).toEqual(expectedUnformattedArray)
  })

  it("should return an empty object for null or non-object values", () => {
    const formattedArray = [
      {key1: 1, key2: null},
      null,
      123,
      "string",
      true,
      undefined
    ]
    const expectedUnformattedArray = [
      {key1: 1, key2: null},
      {},
      {},
      {},
      {},
      {}
    ]
    expect(unformatArrayObjects(formattedArray)).toEqual(expectedUnformattedArray)
  })
})

describe("unflattenObject", () => {
  it("should return an empty object when given an empty object", () => {
    const inputObj = {}
    const expectedOutputObj = {}
    expect(unflattenObject(inputObj)).toEqual(expectedOutputObj)
  })

  it("should return the same object when given an already unflattened object", () => {
    const inputObj = {key1: 1, key2: {key3: 3}}
    const expectedOutputObj = {key1: 1, key2: {key3: 3}}
    expect(unflattenObject(inputObj)).toEqual(expectedOutputObj)
  })

  it("should return a correctly unflattened object when given a flattened object with one level of nesting", () => {
    const inputObj = {
      'key1:key2': 1,
      'key3:key4': 2
    }
    const expectedOutputObj = {
      key1: {key2: 1},
      key3: {key4: 2}
    }
    expect(unflattenObject(inputObj)).toEqual(expectedOutputObj)
  })

  it("should return a correctly unflattened object when given a flattened object with multiple levels of nesting", () => {
    const inputObj = {
      'key1:key2:key3': 1,
      'key1:key4:key5': 2
    }
    const expectedOutputObj = {
      key1: {
        key2: {
          key3: 1
        },
        key4: {
          key5: 2
        }
      }
    }
    expect(unflattenObject(inputObj)).toEqual(expectedOutputObj)
  })
})

describe("arrayDenormalizer", () => {
  it("should return an empty array when given an empty array", () => {
    const inputArr = []
    const expectedOutputArr = []
    expect(arrayDenormalizer(inputArr)).toEqual(expectedOutputArr)
  })

  it("should correctly denormalize a single-level array of objects", () => {
    const inputArr = [
      {key1: 1, key2: 2},
      {key1: 3, key2: 4},
      {key1: 5, key2: 6}
    ]
    const expectedOutputArr = [
      [1, 2],
      [3, 4],
      [5, 6]
    ]
    expect(arrayDenormalizer(inputArr)).toEqual(expectedOutputArr)
  })

  it("should correctly denormalize a multi-level array of objects", () => {
    const inputArr = [
      {'key1:key2': 1, 'key3:key4': 2},
      {'key1:key2': 3, 'key3:key4': 4},
      {'key1:key2': 5, 'key3:key4': 6}
    ]
    const expectedOutputArr = [
      [1, 2],
      [3, 4],
      [5, 6]
    ]
    expect(arrayDenormalizer(inputArr)).toEqual(expectedOutputArr)
  })
})

describe("objectDenormalizer", () => {
  it("should return an empty object when given an empty object", () => {
    const inputObj = {}
    const expectedOutputObj = {}
    expect(objectDenormalizer(inputObj)).toEqual(expectedOutputObj)
  })

  it("should correctly denormalize a single-level object", () => {
    const inputObj = {key1: 1, key2: 2}
    const expectedOutputObj = {key1: 1, key2: 2}
    expect(objectDenormalizer(inputObj)).toEqual(expectedOutputObj)
  })

  it("should correctly denormalize a multi-level object", () => {
    const inputObj = {'key1:key2:key3': 1, 'key4:key5:key6': 2}
    const expectedOutputObj = {
      key1: {key2: {key3: 1}},
      key4: {key5: {key6: 2}}
    }
    expect(objectDenormalizer(inputObj)).toEqual(expectedOutputObj)
  })
})

describe("denormalize", () => {
  it("should return an error for invalid input", () => {
    const input = "invalid input"
    const expectedOutput = new Error('Invalid input')
    expect(denormalize(input)).toEqual(expectedOutput)
  })

  it("should correctly denormalize an array of objects", () => {
    const input = [
      {key1: 1, key2: 2},
      {key1: 3, key2: 4}
    ]
    const expectedOutput = [
      [1, 2],
      [3, 4]
    ]
    expect(denormalize(input)).toEqual(expectedOutput)
  })

  it("should correctly denormalize an object", () => {
    const input = [1, 2]
    const expectedOutput = { a: { b: 1 }, c: 2 }
    expect(denormalize(input)).toEqual(expectedOutput)
  })

  it("should correctly denormalize a nested object", () => {
    const input = {
      key1: {key2: {key3: 1, key4: 2}, key5: 3},
      key6: 4
    }
    const expectedOutput = {
      key1: {key2: [1, 2], key5: 3},
      key6: 4
    }
    expect(denormalize(input)).toEqual(expectedOutput)
  })
})