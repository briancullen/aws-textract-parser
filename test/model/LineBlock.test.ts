import LineBlock from '../../src/model/LineBlock'
import TextractWordBlock from '../../src/model/WordBlock'
import { Geometry } from '../../src/model/Geometry'

describe('Textract line block implementation', () => {
  it('should construct line block instance', () => {
    // Given
    const id = '12345-ABC'
    const text = 'word'
    const confidence = 87.45243524
    const geometry: Geometry = {
      boundaryBox: { top: 1, left: 2, width: 3, height: 4 },
      polygon: [{ x: 1, y: 2 }]
    }

    // When
    const line = new LineBlock(id, geometry, text, confidence, [])

    // Then
    expect(line.id).toEqual(id)
    expect(line.text).toEqual(text)
    expect(line.geometry).toStrictEqual(geometry)
    expect(line.confidence).toEqual(confidence)
    expect(line.children()).toEqual([])
  })

  it('should sort word block instances', () => {
    // Given
    const id = '12345-ABC'
    const text = 'word'
    const confidence = 56.143123413
    const polygon = [{ x: 1, y: 2 }]

    const geometry1: Geometry = {
      boundaryBox: { top: 1, left: 9, width: 3, height: 4 },
      polygon
    }

    const geometry2: Geometry = {
      boundaryBox: { top: 1, left: 7, width: 3, height: 4 },
      polygon
    }

    const geometry3: Geometry = {
      boundaryBox: { top: 1, left: 5, width: 3, height: 4 },
      polygon
    }

    const word1 = new TextractWordBlock('id1', geometry1, text, confidence)
    const word2 = new TextractWordBlock('id2', geometry2, text, confidence)
    const word3 = new TextractWordBlock('id3', geometry3, text, confidence)

    // When
    const line = new LineBlock(id, geometry1, text, confidence, [word1, word2, word3])

    // Then
    expect(line.id).toEqual(id)
    expect(line.text).toEqual(text)
    expect(line.geometry).toStrictEqual(geometry1)
    expect(line.confidence).toEqual(confidence)

    expect(line.children()).toEqual([word3, word2, word1])
  })
})
