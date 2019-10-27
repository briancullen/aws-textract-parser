import TextractLineBlock from '../../src/textract/TextractLineBlock'
import { Geometry } from '../../src/api'

describe('Textract line block implementation', () => {
  it('should construct line block instance', () => {
    // Given
    const id = '12345-ABC'
    const text = 'word'
    const geometry: Geometry = {
      boundaryBox: { top: 1, left: 2, width: 3, height: 4 },
      polygon: [{ x: 1, y: 2 }]
    }

    // When
    const line = new TextractLineBlock(id, geometry, text, [])

    // Then
    expect(line.id).toEqual(id)
    expect(line.text).toEqual(text)
    expect(line.geometry).toStrictEqual(geometry)
    expect(line.children()).toEqual([])
  })
})
