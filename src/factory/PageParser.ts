import { Textract } from 'aws-sdk'
import PageBlockNode from '../model/PageBlockNode'
import LineBlockNode from '../model/LineBlockNode'
import { BlockParser, GeometryParser, BlockIdParser } from './Factory'

export default class PageParser implements BlockParser<PageBlockNode> {
  constructor (private readonly lineParser: BlockParser<LineBlockNode>,
    private readonly geometryParser: GeometryParser,
    private readonly blockIdParser: BlockIdParser,
    private readonly blockMap: Map<string, Textract.Block>) {
  }

  process (page: Textract.Block): PageBlockNode {
    const children = page.Relationships?.find(relationship => relationship.Type === 'CHILD')?.Ids ?? []
    const lines = children.map(id => this.blockMap.get(id))
      .filter((block): block is Textract.Block => block !== undefined)
      .filter(block => block.BlockType === 'LINE')
      .map(block => this.lineParser.process(block))

    const id = this.blockIdParser(page)
    const geometry = this.geometryParser(page)
    return new PageBlockNode(id, geometry, lines)
  }
}
