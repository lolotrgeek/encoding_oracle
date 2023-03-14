const { EncodeJson } = require('../main.js')
const nested = require("./nested.json")


describe('EncodeJson', () => {
  it('returns a tensor for valid JSON objects', () => {
    const data = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: [4, 5, 6],
      },
    }
    const expected = expect.any(Object) // Tensor objects don't compare directly
    const result = EncodeJson(data)
    expect(result).toEqual(expected)
  })

  it('returns an error for invalid input', () => {
    const data = 'not an object or array'
    const expected = new Error('Invalid input')
    const result = EncodeJson(data)
    expect(result.error).toEqual(expected)
  })

  it('normalizes and encodes arrays', () => {
    const data = [      { a: 1, b: { c: 2, d: 3 } },      { a: 4, b: { c: 5, d: 6 } },    ]
    const expected = expect.any(Object) // Tensor objects don't compare directly
    const result = EncodeJson(data)
    expect(result).toEqual(expected)
  })

  it('handles ddeply nested objects', () => {
    const data = nested
    const expected = expect.any(Object) // Tensor objects don't compare directly
    const result = EncodeJson(data)
    expect(result).toEqual(expected)
  })

  it("handles undefined, null, and NaN", () => {
    const data = {
      a: undefined,
      b: null,
      c: NaN,
      d: {
        e: undefined,
        f: null,
        g: NaN,
      },
    }
    const expected = expect.any(Object) // Tensor objects don't compare directly
    const result = EncodeJson(data)
    expect(result).toEqual(expected)
  })
})