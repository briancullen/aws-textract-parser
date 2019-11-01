import PageBlockNode from '../../src/model/PageBlockNode'
import LineBlockNode from '../../src/model/LineBlockNode'
import { Geometry } from '../../src/model/Geometry'
import { BlockType } from '../../src/types'

describe('Textract page block implementation', () => {
  it('should construct page block instance', () => {
    // Given
    const id = '12345-ABC'
    const text = 'word'
    const confidence = 1
    const geometry: Geometry = {
      boundaryBox: { top: 1, left: 2, width: 3, height: 4 },
      polygon: [{ x: 1, y: 2 }]
    }

    const line = new LineBlockNode(id, geometry, text, confidence, [])

    // When
    const page = new PageBlockNode(id, geometry, [line])

    // Then
    expect(page.id).toEqual(id)
    expect(page.geometry).toStrictEqual(geometry)
    expect(page.children()).toEqual([line])
    expect(page.blockType).toBe(BlockType.Page)
  })
})
