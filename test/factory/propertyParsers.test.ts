import { Textract } from 'aws-sdk'
import { geometryParser, blockIdParser } from '../../src/factory/porpertyParsers'

describe('Geometry Parser', () => {
  it('should parse geometry from block', () => {
    // Given
    const block = {
      Geometry: {
        BoundingBox: {
          Top: 0.1243534523452,
          Left: 0.1235243623546,
          Width: 0.2345234513564,
          Height: 0.1524362353456
        },
        Polygon: [
          { X: 7.235423452345, Y: 1.25634576345123 },
          { X: 6.253462546745, Y: 2.23452346232345 },
          { X: 5.345678876754, Y: 3.58567856785667 }
        ]
      }
    }

    // When
    const geometry = geometryParser(block)

    // Then
    expect(geometry.boundaryBox.top).toEqual(block.Geometry.BoundingBox.Top)
    expect(geometry.boundaryBox.left).toEqual(block.Geometry.BoundingBox.Left)
    expect(geometry.boundaryBox.width).toEqual(block.Geometry.BoundingBox.Width)
    expect(geometry.boundaryBox.height).toEqual(block.Geometry.BoundingBox.Height)

    expect(geometry.polygon.length).toEqual(block.Geometry.Polygon.length)
    block.Geometry.Polygon.forEach((point, index) => {
      expect(geometry.polygon[index].x).toEqual(point.X)
      expect(geometry.polygon[index].y).toEqual(point.Y)
    })
  })

  it('should default to -1 if geometry not provided', () => {
    // Given
    const block: Textract.Block = {}

    // When
    const geometry = geometryParser(block)

    // Then
    expect(geometry.boundaryBox.top).toEqual(-1)
    expect(geometry.boundaryBox.left).toEqual(-1)
    expect(geometry.boundaryBox.width).toEqual(-1)
    expect(geometry.boundaryBox.height).toEqual(-1)
    expect(geometry.polygon).toEqual([])
  })

  it('should default to -1 if blank point provided', () => {
    // Given
    const block: Textract.Block = {
      Geometry: {
        Polygon: [{}]
      }
    }

    // When
    const geometry = geometryParser(block)

    // Then
    expect(geometry.polygon.length).toEqual(1)
    expect(geometry.polygon[0].x).toEqual(-1)
    expect(geometry.polygon[0].y).toEqual(-1)
  })
})

describe('Block Id Parser', () => {
  it('should parse id from block', () => {
    // Given
    const expectedId = 'some id'
    const block: Textract.Block = { Id: expectedId }

    // When
    const id = blockIdParser(block)

    // Then
    expect(id).toEqual(expectedId)
  })

  it('should default unknown with blank id', () => {
    // Given
    const block: Textract.Block = {}

    // When
    const id = blockIdParser(block)

    // Then
    expect(id).toEqual('unknown')
  })
})
