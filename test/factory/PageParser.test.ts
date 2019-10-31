import { Textract } from 'aws-sdk'
import PageParser from '../../src/factory/PageParser'
import { Geometry } from '../../src/model/Geometry'
import LineBlockNode from '../../src/model/LineBlockNode'

describe('Page block parser', () => {
  const geometry: Geometry = {
    boundaryBox: { top: 1, left: 2, width: 3, height: 4 },
    polygon: []
  }

  const geometrySpy = jest.fn()
  const blockIdSpy = jest.fn()
  const lineParser = {
    process: jest.fn(() => new LineBlockNode('id', geometry, 'text', 0, []))
  }

  beforeEach(() => {
    geometrySpy.mockClear()
    blockIdSpy.mockClear()
    lineParser.process.mockClear()
  })

  it('should parse page block', () => {
    // Given
    const block = {
      Relationships: [{
        Type: 'CHILD',
        Ids: ['1', '3', '4']
      }]
    }

    const blockMap = new Map<string, Textract.Block>()
    blockMap.set('1', { Text: '1', BlockType: 'LINE' })
    blockMap.set('2', { Text: '2', BlockType: 'LINE' })
    blockMap.set('3', { Text: '3', BlockType: 'LINE' })
    blockMap.set('4', { Text: '4', BlockType: 'LINE' })

    const pageParser = new PageParser(lineParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = pageParser.process(block)

    // Then
    expect(geometrySpy).toHaveBeenCalledWith(block)
    expect(blockIdSpy).toHaveBeenCalledWith(block)

    expect(lineParser.process).toHaveBeenCalledTimes(3)
    expect(lineParser.process).toHaveBeenCalledWith(blockMap.get('1'))
    expect(lineParser.process).toHaveBeenCalledWith(blockMap.get('3'))
    expect(lineParser.process).toHaveBeenCalledWith(blockMap.get('4'))

    expect(result.children().length).toEqual(3)
    result.children().forEach(child => expect(child.parent()).toBe(result))
  })

  it('should ignore children that are not lines', () => {
    // Given
    const block = {
      Relationships: [{
        Type: 'CHILD',
        Ids: ['1', '3', '4']
      }]
    }

    const blockMap = new Map<string, Textract.Block>()
    blockMap.set('1', { Text: '1', BlockType: 'LINE' })
    blockMap.set('2', { Text: '2', BlockType: 'WORD' })
    blockMap.set('3', { Text: '3', BlockType: 'WORD' })
    blockMap.set('4', { Text: '4', BlockType: 'LINE' })

    const pageParser = new PageParser(lineParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = pageParser.process(block)

    // Then
    expect(geometrySpy).toHaveBeenCalledWith(block)
    expect(blockIdSpy).toHaveBeenCalledWith(block)

    expect(lineParser.process).toHaveBeenCalledTimes(2)
    expect(lineParser.process).toHaveBeenCalledWith(blockMap.get('1'))
    expect(lineParser.process).toHaveBeenCalledWith(blockMap.get('4'))
    expect(result.children().length).toEqual(2)
  })

  it('should return empty children if empty relationships', () => {
    // Given
    const block = {
      Relationships: []
    }

    const blockMap = new Map<string, Textract.Block>()
    const pageParser = new PageParser(lineParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = pageParser.process(block)

    // Then
    expect(result.children()).toEqual([])
    expect(lineParser.process).not.toHaveBeenCalled()
  })

  it('should return empty children if no relationships', () => {
    // Given
    const expectedText = 'expected'
    const block = {
      Text: expectedText
    }

    const blockMap = new Map<string, Textract.Block>()
    const pageParser = new PageParser(lineParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = pageParser.process(block)

    // Then
    expect(result.children()).toEqual([])
    expect(lineParser.process).not.toHaveBeenCalled()
  })

  it('should return empty children if no relationship ids', () => {
    // Given
    const block = {
      Relationships: [{
        Type: 'CHILD'
      }]
    }

    const blockMap = new Map<string, Textract.Block>()
    const pageParser = new PageParser(lineParser, geometrySpy, blockIdSpy, blockMap)

    // When
    const result = pageParser.process(block)

    // Then
    expect(result.children()).toEqual([])
    expect(lineParser.process).not.toHaveBeenCalled()
  })
})
