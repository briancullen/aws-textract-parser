import Document from '../../src/model/Document'
import { Blocks, Block } from '../../src/types'
import TextractWordBlock from '../../src/model/WordBlock'
import LineBlock from '../../src/model/LineBlock'
import TextractPageBlock from '../../src/model/PageBlock'
import Geometry from '../../src/model/Geometry'

describe('Textract point implementation', () => {
  it('should construct point instance', () => {
    // Given
    const pages = 3
    const children: Blocks<Block> = []

    // When
    const document = new Document(pages, children)

    // Then
    expect(document.metadata.pages).toEqual(pages)
    expect(document.children()).toEqual([])
    expect(document.pages.children()).toEqual([])
  })

  it('should extract pages from other blocks', () => {
    // Given
    const pages = 4
    const id = '12345-ABC'
    const text = 'word'
    const geometry: Geometry = {
      boundaryBox: { top: 1, left: 2, width: 3, height: 4 },
      polygon: [{ x: 1, y: 2 }]
    }

    const line = new LineBlock(id, geometry, text, [])
    const page = new TextractPageBlock(id, geometry, [line])
    const word = new TextractWordBlock(id, geometry, text)
    const blocks = [line, page, word]

    // When
    const document = new Document(pages, blocks)

    // Then
    const parent = document.pages
    expect(parent.children()).toEqual([page])
    expect(document.children()).toEqual(blocks)
  })
})
