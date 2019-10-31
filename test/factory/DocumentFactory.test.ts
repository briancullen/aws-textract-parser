import { Textract } from 'aws-sdk'
import { DocumentParser } from '../../src/factory/DocumentParser'

describe('Document Parser', () => {
  const pageParser = { process: jest.fn() }
  const parserFactory = jest.fn(() => pageParser)
  const documentParser = new DocumentParser(parserFactory)

  beforeEach(() => {
    pageParser.process.mockClear()
  })

  it('should parse page blocks', () => {
    // Given
    const textractResponse = {
      DocumentMetadata: {
        Pages: 2
      },
      Blocks: [
        { Id: '1', BlockType: 'PAGE' },
        { Id: '2', BlockType: 'LINE' },
        { Id: '3', BlockType: 'PAGE' },
        { Id: '4', BlockType: 'LINE' }
      ]
    }

    // When
    const result = documentParser.process(textractResponse)

    // Then
    expect(result.metadata.pages).toEqual(2)
    expect(pageParser.process).toHaveBeenCalledTimes(2)
    expect(pageParser.process).toHaveBeenCalledWith(textractResponse.Blocks[0])
    expect(pageParser.process).toHaveBeenCalledWith(textractResponse.Blocks[2])
    expect(result.children().length).toEqual(2)
  })

  it('should not parse if no metadata', () => {
    // Given
    const textractResponse = {
      Blocks: [
        { Id: '1', BlockType: 'PAGE' },
        { Id: '2', BlockType: 'LINE' },
        { Id: '3', BlockType: 'PAGE' },
        { Id: '4', BlockType: 'LINE' }
      ]
    }

    // When
    const result = documentParser.process(textractResponse)

    // Then
    expect(result.metadata.pages).toEqual(0)
    expect(pageParser.process).not.toHaveBeenCalled()
    expect(result.children().length).toEqual(0)
  })

  it('should not parse if pages not set in metadata', () => {
    // Given
    const textractResponse = {
      DocumentMetadata: {},
      Blocks: [
        { Id: '1', BlockType: 'PAGE' },
        { Id: '2', BlockType: 'LINE' },
        { Id: '3', BlockType: 'PAGE' },
        { Id: '4', BlockType: 'LINE' }
      ]
    }

    // When
    const result = documentParser.process(textractResponse)

    // Then
    expect(result.metadata.pages).toEqual(0)
    expect(pageParser.process).not.toHaveBeenCalled()
    expect(result.children().length).toEqual(0)
  })

  it('should return empty children if empty blocks', () => {
    // Given
    const textractResponse = {
      DocumentMetadata: {
        Pages: 2
      },
      Blocks: []
    }

    // When
    const result = documentParser.process(textractResponse)

    // Then
    expect(result.metadata.pages).toEqual(0)
    expect(pageParser.process).not.toHaveBeenCalled()
    expect(result.children().length).toEqual(0)
  })

  it('should return empty children if no blocks', () => {
    // Given
    const textractResponse = {
      DocumentMetadata: {
        Pages: 2
      }
    }

    // When
    const result = documentParser.process(textractResponse)

    // Then
    expect(result.metadata.pages).toEqual(0)
    expect(pageParser.process).not.toHaveBeenCalled()
    expect(result.children().length).toEqual(0)
  })

  it('should create parser with correct map', () => {
    // Given
    const textractResponse = {
      DocumentMetadata: {
        Pages: 2
      },
      Blocks: [
        { Id: '1', BlockType: 'PAGE' },
        { Id: '2', BlockType: 'LINE' },
        { Id: '3', BlockType: 'PAGE' },
        { Id: '4', BlockType: 'LINE' }
      ]
    }

    // When
    documentParser.process(textractResponse)

    // Then
    const map: Map<string, Textract.Block> = ((parserFactory.mock.calls[0] as any)[0])
    expect(map.size).toEqual(textractResponse.Blocks.length)
    textractResponse.Blocks.forEach(block => expect(map.get(block.Id)).toEqual(block))
  })
})
