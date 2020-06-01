/**
* Define your tests here.
* 
* Reference:
*  - Mocha Test Runner: https://mochajs.org/
*  - Chai Assertion Library: https://www.chaijs.com/
*/
import * as myModule from '../index.js'
describe('My Module', () => {
  describe('hello()', () => {
    it('should accept an audience string', () => {
      chai.assert.equal(myModule.hello('friends'), 'hello friends')
    })
    it('should default to "world"', () => {
      chai.assert.equal(myModule.hello(), 'hello world')
    })
  })
})