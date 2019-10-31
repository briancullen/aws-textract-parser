import TextractWordBlock from '../../src/model/WordBlock'
import Geometry from '../../src/model/Geometry'

describe('Textract word block implementation', () => {
  it('should construct word block instance', () => {
    // Given
    const id = '12345-ABC'
    const text = 'word'
    const confidence = 99.99999
    const geometry: Geometry = {
      boundaryBox: { top: 1, left: 2, width: 3, height: 4 },
      polygon: [{ x: 1, y: 2 }]
    }

    // When
    const word = new TextractWordBlock(id, geometry, text, confidence)

    // Then
    expect(word.id).toEqual(id)
    expect(word.text).toEqual(text)
    expect(word.geometry).toStrictEqual(geometry)
    expect(word.confidence).toEqual(confidence)
  })
})
