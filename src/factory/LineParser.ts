import { Textract } from 'aws-sdk'
import LineBlock from '../model/LineBlock'
import WordBlock from '../model/WordBlock'
import { BlockParser, GeometryParser, BlockIdParser } from './Factory'

export default class LineParser implements BlockParser<LineBlock> {
  constructor (private readonly wordParser: BlockParser<WordBlock>,
    private readonly geometryParser: GeometryParser,
    private readonly blockIdParser: BlockIdParser,
    private readonly blockMap: Map<string, Textract.Block>) {
  }

  process (line: Textract.Block): LineBlock {
    const children = line.Relationships?.find(relationship => relationship.Type === 'CHILD')?.Ids ?? []
    const words = children.map(id => this.blockMap.get(id))
      .filter((block): block is Textract.Block => block !== undefined)
      .filter(block => block.BlockType === 'WORD')
      .map(block => this.wordParser.process(block))

    const id = this.blockIdParser(line)
    const geometry = this.geometryParser(line)
    const text = line.Text ?? ''
    return new LineBlock(id, geometry, text, words)
  }
}
