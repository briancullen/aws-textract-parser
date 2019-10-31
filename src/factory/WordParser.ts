import { Textract } from 'aws-sdk'
import WordBlock from '../model/WordBlockNode'
import { BlockParser, BlockIdParser, GeometryParser } from './Factory'

export default class WordParser implements BlockParser<WordBlock> {
  constructor (private readonly geometryParser: GeometryParser,
    private readonly blockIdParser: BlockIdParser) {
  }

  process (word: Textract.Block): WordBlock {
    const id = this.blockIdParser(word)
    const geometry = this.geometryParser(word)
    const confidence = word.Confidence ?? 0
    const text = word.Text ?? ''
    return new WordBlock(id, geometry, text, confidence)
  }
}
