import DocumentNode from '../../src/model/DocumentNode'
import PageBlockNode from '../../src/model/PageBlockNode'

describe('Textract point implementation', () => {
  it('should construct document instance', () => {
    // Given
    const children: PageBlockNode[] = []

    // When
    const document = new DocumentNode(children)

    // Then
    expect(document.metadata.pages).toEqual(children.length)
    expect(document.children()).toEqual([])
    expect(document.children()).toEqual([])
  })
})
