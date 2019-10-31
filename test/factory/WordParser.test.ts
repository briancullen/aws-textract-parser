import { Textract } from 'aws-sdk'
import WordParser from '../../src/factory/WordParser'

describe('Word block parser', () => {
  const geometrySpy = jest.fn()
  const blockIdSpy = jest.fn()
  const wordParser = new WordParser(geometrySpy, blockIdSpy)

  beforeEach(() => {
    geometrySpy.mockClear()
    blockIdSpy.mockClear()
  })

  it('should parse word block', () => {
    // Given
    const expectedText = 'expected'
    const block: Textract.Block = {
      Text: expectedText
    }

    // When
    const result = wordParser.process(block)

    // Then
    expect(result.text).toEqual(expectedText)
    expect(geometrySpy).toHaveBeenCalledWith(block)
    expect(blockIdSpy).toHaveBeenCalledWith(block)
  })

  it('should parse blank word block', () => {
    // Given
    const block: Textract.Block = {}

    // When
    const result = wordParser.process(block)

    // Then
    expect(result.text).toEqual('')
  })
})
