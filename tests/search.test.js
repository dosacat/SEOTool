const {search} = require('../search.js')
const {test, expect} = require('@jest/globals')

test('https url',()=>{
    const input="https://www.freecodecamp.org/news/"
    const actual = search(input)
    const expected="www.freecodecamp.org/news"
    expect(actual).toEqual(expected)
})

test('http url', () => {
    const input = 'http://www.freecodecamp.org/path'
    const actual = search(input)
    const expected = 'www.freecodecamp.org/path'
    expect(actual).toEqual(expected)
  })