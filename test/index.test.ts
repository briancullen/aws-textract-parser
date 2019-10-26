import insulter from '../src'

describe('Insult test', () => {
    it('Should insult', () => {
        const insult = insulter()
        expect(insult).toBe(`You're ugly!`)
    })
})