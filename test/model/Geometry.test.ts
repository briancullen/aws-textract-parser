import { Geometry, BoundaryBox, Point } from '../../src/model/Geometry'

describe('Textract point implementation', () => {
  it('should construct point instance', () => {
    // Given
    const boundaryBox = { top: 1, left: 2, width: 3, height: 4 }
    const polygon = [{ x: 1, y: 2 }]

    // When
    const geometry = new Geometry(boundaryBox, polygon)

    // Then
    expect(geometry.boundaryBox).toEqual(boundaryBox)
    expect(geometry.polygon).toEqual(polygon)
  })
})

describe('Textract boundary box implementation', () => {
  it('should construct bondary box instance', () => {
    // Given
    const top = 0.234567
    const left = 0.876543
    const width = 0.29384756
    const height = 0.9998765

    // When
    const box = new BoundaryBox(top, left, width, height)

    // Then
    expect(box.top).toEqual(top)
    expect(box.left).toEqual(left)
    expect(box.width).toEqual(width)
    expect(box.height).toEqual(height)
  })
})

describe('Textract point implementation', () => {
  it('should construct point instance', () => {
    // Given
    const x = 0.234567
    const y = 0.876543

    // When
    const point = new Point(x, y)

    // Then
    expect(point.x).toEqual(x)
    expect(point.y).toEqual(y)
  })
})