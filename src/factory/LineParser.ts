import { Textract } from 'aws-sdk'
import LineBlockNode from '../model/LineBlockNode'
import WordBlock from '../model/WordBlockNode'
import { BlockParser, GeometryParser, BlockIdParser } from './Factory'

export default class LineParser implements BlockParser<LineBlockNode> {
  constructor (private readonly wordParser: BlockParser<WordBlock>,
    private readonly geometryParser: GeometryParser,
    private readonly blockIdParser: BlockIdParser,
    private readonly blockMap: Map<string, Textract.Block>) {
  }

  process (line: Textract.Block): LineBlockNode {
    const children = line.Relationships?.find(relationship => relationship.Type === 'CHILD')?.Ids ?? []
    const words = children.map(id => this.blockMap.get(id))
      .filter((block): block is Textract.Block => block !== undefined)
      .filter(block => block.BlockType === 'WORD')
      .map(block => this.wordParser.process(block))

    const id = this.blockIdParser(line)
    const geometry = this.geometryParser(line)
    const confidence = line.Confidence ?? 0
    const text = line.Text ?? ''
    return new LineBlockNode(id, geometry, text, confidence, words)
  }
}
