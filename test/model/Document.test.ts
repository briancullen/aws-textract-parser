import Document from '../../src/model/Document'
import { Blocks } from '../../src/types'
import PageBlock from '../../src/model/PageBlock'

describe('Textract point implementation', () => {
  it('should construct point instance', () => {
    // Given
    const children: Blocks<PageBlock> = []

    // When
    const document = new Document(children)

    // Then
    expect(document.metadata.pages).toEqual(children.length)
    expect(document.children()).toEqual([])
    expect(document.children()).toEqual([])
  })
})
