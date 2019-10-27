import TextractPoint from '../../src/model/Point'

describe('Textract point implementation', () => {
  it('should construct point instance', () => {
    // Given
    const x = 0.234567
    const y = 0.876543

    // When
    const point = new TextractPoint(x, y)

    // Then
    expect(point.x).toEqual(x)
    expect(point.y).toEqual(y)
  })
})
