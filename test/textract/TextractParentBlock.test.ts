import TextractParentBlock from '../../src/textract/TextractParentBlock'
import TextractWordBlock from '../../src/textract/TextractWordBlock'
import { Geometry, WordBlock } from '../../src/api'

describe('Textract parent block implementation', () => {
  const text = 'text'
  const geometry: Geometry = {
    boundaryBox: { top: 1, left: 2, width: 3, height: 4 },
    polygon: [{ x: 1, y: 2 }]
  }

  const word1 = new TextractWordBlock('id1', geometry, text)
  const word2 = new TextractWordBlock('id2', geometry, text)
  const word3 = new TextractWordBlock('id3', geometry, text)

  const words = [word1, word2]
  const block = new TextractParentBlock<WordBlock>(words)

  it('should return children', () => {
    // Then
    expect(block.children()).toHaveLength(2)
    expect(block.children()).toEqual(words)
  })

  it('should check if block has child', () => {
    // Then
    expect(block.hasChild(word1)).toBe(true)
    expect(block.hasChild(word2)).toBe(true)
    expect(block.hasChild(word3)).toBe(false)
  })

  it('should get child by id', () => {
    // Then
    expect(block.get(word1.id)).toBe(word1)
    expect(block.get(word2.id)).toBe(word2)
    expect(block.get(word3.id)).toBeUndefined()
  })
})
