import { Geometry } from '../../src/model/Geometry'
import WordBlock from '../../src/model/WordBlockNode'
import Document from '../../src/model/DocumentNode'
import BlockNode from '../../src/model/BlockNode'

describe('Block node implementation', () => {
  const text = 'text'
  const confidence = 99.9999999999
  const geometry: Geometry = {
    boundaryBox: { top: 1, left: 2, width: 3, height: 4 },
    polygon: [{ x: 1, y: 2 }]
  }

  const word1 = new WordBlock('id1', geometry, text, confidence)
  const word2 = new WordBlock('id2', geometry, text, confidence)
  const word3 = new WordBlock('id3', geometry, text, confidence)

  const words = [word1, word2]
  const document = new Document([])

  it('should return children', () => {
    // When
    const block = new BlockNode<Document, WordBlock>(words)

    // Then
    expect(block.children()).toHaveLength(2)
    expect(block.children()).toEqual(words)
  })

  it('should check if block has child', () => {
    // When
    const block = new BlockNode<Document, WordBlock>(words)

    // Then
    expect(block.hasChild(word1)).toBe(true)
    expect(block.hasChild(word2)).toBe(true)
    expect(block.hasChild(word3)).toBe(false)
  })

  it('should return undefined if parent not set', () => {
    // When
    const block = new BlockNode<Document, WordBlock>(words)

    // Then
    expect(block.parent()).toBeUndefined()
  })

  it('should return parent', () => {
    // Given
    const block = new BlockNode<Document, WordBlock>(words)

    // When
    block.setParant(document)

    // Then
    expect(block.parent()).toBe(document)
  })
})
