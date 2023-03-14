
const { reverse_normalize, reverse_arrayNormalizer,reverse_formatArrayObjects,  reverse_objectNormalizer, reverse_flattenObject, reverse_len, decode} = require('./decoder.js')

describe('Decoder', () => {  
    test('reverse_arrayNormalizer', () => {
        const array = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
        ]
        const expected = [
        { 0: 1, 1: 2, 2: 3 },
        { 0: 4, 1: 5, 2: 6 },
        { 0: 7, 1: 8, 2: 9 }
        ]
        expect(reverse_arrayNormalizer(array)).toEqual(expected)
    })
    test('reverse_formatArrayObjects', () => {
        const array = [
        { 0: 1, 1: 2, 2: 3 },
        { 0: 4, 1: 5, 2: 6 },
        { 0: 7, 1: 8, 2: 9 }
        ]
        const expected = [
        { 2: 3, 1: 2, 0: 1 },
        { 2: 6, 1: 5, 0: 4 },
        { 2: 9, 1: 8, 0: 7 }
        ]
        expect(reverse_formatArrayObjects(array)).toEqual(expected)
    })
    test('reverse_normalize', () => {
        const array = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
        ]
        const expected = [
        { 2: 3, 1: 2, 0: 1 },
        { 2: 6, 1: 5, 0: 4 },
        { 2: 9, 1: 8, 0: 7 }
        ]
        expect(reverse_normalize(array)).toEqual(expected)
    })
    test('reverse_objectNormalizer', () => {
        const values = [1, 2, 3]
        const expected = { 2: { 1: { 0: 1 } } }
        expect(reverse_objectNormalizer(values)).toEqual(expected)
    })
    test('reverse_flattenObject', () => {
        const obj = { 2: { 1: { 0: 1 } } }
        const expected = { '2:1:0': 1 }
        expect(reverse_flattenObject(obj)).toEqual(expected)
    })
    test('reverse_len', () => {
        const lst = [1, 2, 3]
        const expected = [3, 2, 1]
        expect(reverse_len(lst)).toEqual(expected)
    })
    test('decode', () => {
        const json = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
        ]
        const expected = [
        { 2: 3, 1: 2, 0: 1 },
        { 2: 6, 1: 5, 0: 4 },
        { 2: 9, 1: 8, 0: 7 }
        ]
        expect(decode(json)).toEqual(expected)
    })

})