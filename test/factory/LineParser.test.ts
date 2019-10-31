import { Textract } from 'aws-sdk'
import LineParser from '../../src/factory/LineParser'
import WordBlockNode from '../../src/model/WordBlockNode'
import { Geometry } from '../../src/model/Geometry'

describe('Line block parser', () => {
  const geometry: Geometry = {
    boundaryBox: { top: 1, left: 2, width: 3, height: 4 },
    polygon: []
  }

  const geometrySpy = jest.fn()
  const blockIdSpy = jest.fn()
  const wordParser = {
    process: jest.fn(() => new WordBlockNode('id', geometry, 'text', 0))
  }

  beforeEach(() => {
    geometrySpy.mockClear()
    blockIdSpy.mockClear()
    wordParser.process.mockClear()
  })

  it('should parse line block', () => {
    // Given
    const expectedText = 'expected'
    const confidence = 99.11111
    const block = {
      Text: expectedText,
      Confidence: confidence,
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
    expect(result.confidence).toEqual(confidence)
    expect(geometrySpy).toHaveBeenCalledWith(block)
    expect(blockIdSpy).toHaveBeenCalledWith(block)

    expect(wordParser.process).toHaveBeenCalledTimes(3)
    expect(wordParser.process).toHaveBeenCalledWith(blockMap.get('1'))
    expect(wordParser.process).toHaveBeenCalledWith(blockMap.get('3'))
    expect(wordParser.process).toHaveBeenCalledWith(blockMap.get('4'))

    expect(result.children().length).toEqual(3)
    result.children().forEach(child => expect(child.parent()).toBe(result))
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
    expect(result.confidence).toEqual(0)
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
