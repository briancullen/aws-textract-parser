import { Textract } from 'aws-sdk'
import LineParser from '../../src/factory/LineParser'

describe('Line block parser', () => {
  const geometrySpy = jest.fn()
  const blockIdSpy = jest.fn()
  const wordParser = {
    process: jest.fn()
  }

  beforeEach(() => {
    geometrySpy.mockClear()
    blockIdSpy.mockClear()
    wordParser.process.mockClear()
  })

  it('should parse line block', () => {
    // Given
    const expectedText = 'expected'
    const block = {
      Text: expectedText,
      Relationships: [{
        Type: 'CHILD',
        Ids: ['1', '3', '4']
      }]
    }

    const blockMap = new Map<string, Textract.Block>()
    blockMap.set('1', { Text: '1', BlockType: 'WORD' })
    blockMap.set('2', { Text: '2', BlockType: 'WORD' })
    blockMap.set('3', { Text: '3', BlockType: 'WORD' })
    blockMap.set('4', { Text: '4', BlockType: 'WORD' })

    const lineParser = new LineParser(wordParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = lineParser.process(block)

    // Then
    expect(result.text).toEqual(expectedText)
    expect(geometrySpy).toHaveBeenCalledWith(block)
    expect(blockIdSpy).toHaveBeenCalledWith(block)

    expect(wordParser.process).toHaveBeenCalledTimes(3)
    expect(wordParser.process).toHaveBeenCalledWith(blockMap.get('1'))
    expect(wordParser.process).toHaveBeenCalledWith(blockMap.get('3'))
    expect(wordParser.process).toHaveBeenCalledWith(blockMap.get('4'))
    expect(result.children().length).toEqual(3)
  })

  it('should ignore children that are not words', () => {
    // Given
    const block = {
      Relationships: [{
        Type: 'CHILD',
        Ids: ['1', '3', '4']
      }]
    }

    const blockMap = new Map<string, Textract.Block>()
    blockMap.set('1', { Text: '1', BlockType: 'WORD' })
    blockMap.set('2', { Text: '2', BlockType: 'WORD' })
    blockMap.set('3', { Text: '3', BlockType: 'WORD' })
    blockMap.set('4', { Text: '4', BlockType: 'LINE' })

    const lineParser = new LineParser(wordParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = lineParser.process(block)

    // Then
    expect(result.text).toEqual('')
    expect(geometrySpy).toHaveBeenCalledWith(block)
    expect(blockIdSpy).toHaveBeenCalledWith(block)

    expect(wordParser.process).toHaveBeenCalledTimes(2)
    expect(wordParser.process).toHaveBeenCalledWith(blockMap.get('1'))
    expect(wordParser.process).toHaveBeenCalledWith(blockMap.get('3'))
    expect(result.children().length).toEqual(2)
  })

  it('should return empty children if empty relationships', () => {
    // Given
    const expectedText = 'expected'
    const block = {
      Text: expectedText,
      Relationships: []
    }

    const blockMap = new Map<string, Textract.Block>()
    const lineParser = new LineParser(wordParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = lineParser.process(block)

    // Then
    expect(result.children()).toEqual([])
    expect(wordParser.process).not.toHaveBeenCalled()
  })

  it('should return empty children if no relationships', () => {
    // Given
    const expectedText = 'expected'
    const block = {
      Text: expectedText
    }

    const blockMap = new Map<string, Textract.Block>()
    const lineParser = new LineParser(wordParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = lineParser.process(block)

    // Then
    expect(result.children()).toEqual([])
    expect(wordParser.process).not.toHaveBeenCalled()
  })

  it('should return empty children if no relationship ids', () => {
    // Given
    const block = {
      Relationships: [{
        Type: 'CHILD'
      }]
    }

    const blockMap = new Map<string, Textract.Block>()
    const lineParser = new LineParser(wordParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = lineParser.process(block)

    // Then
    expect(result.children()).toEqual([])
    expect(wordParser.process).not.toHaveBeenCalled()
  })
})
