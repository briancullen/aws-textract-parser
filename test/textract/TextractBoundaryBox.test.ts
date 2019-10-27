import TextractBoundryBox from '../../src/textract/TextractBoundryBox'

describe('Textract boundary box implementation', () => {
  it('should construct bondary box instance', () => {
    // Given
    const top = 0.234567
    const left = 0.876543
    const width = 0.29384756
    const height = 0.9998765

    // When
    const box = new TextractBoundryBox(top, left, width, height)

    // Then
    expect(box.top).toEqual(top)
    expect(box.left).toEqual(left)
    expect(box.width).toEqual(width)
    expect(box.height).toEqual(height)
  })
})
