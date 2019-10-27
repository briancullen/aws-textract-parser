import TextractGeometry from '../../src/textract/TextractGeometry'

describe('Textract point implementation', () => {
  it('should construct point instance', () => {
    // Given
    const boundaryBox = { top: 1, left: 2, width: 3, height: 4 }
    const polygon = [{ x: 1, y: 2 }]

    // When
    const geometry = new TextractGeometry(boundaryBox, polygon)

    // Then
    expect(geometry.boundaryBox).toEqual(boundaryBox)
    expect(geometry.polygon).toEqual(polygon)
  })
})
