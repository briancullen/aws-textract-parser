import { Textract } from 'aws-sdk'
import PageBlock from '../model/PageBlock'
import LineBlock from '../model/LineBlock'
import { BlockParser, GeometryParser, BlockIdParser } from './Factory'

export default class PageParser implements BlockParser<PageBlock> {
  constructor (private readonly lineParser: BlockParser<LineBlock>,
    private readonly geometryParser: GeometryParser,
    private readonly blockIdParser: BlockIdParser,
    private readonly blockMap: Map<string, Textract.Block>) {
  }

  process (page: Textract.Block): PageBlock {
    const children = page.Relationships?.find(relationship => relationship.Type === 'CHILD')?.Ids ?? []
    const lines = children.map(id => this.blockMap.get(id))
      .filter((block): block is Textract.Block => block !== undefined)
      .filter(block => block.BlockType === 'LINE')
      .map(block => this.lineParser.process(block))

    const id = this.blockIdParser(page)
    const geometry = this.geometryParser(page)
    return new PageBlock(id, geometry, lines)
  }
}
