import { Textract } from 'aws-sdk'
import WordBlock from '../model/WordBlock'
import { BlockParser, BlockIdParser, GeometryParser } from './Factory'

export default class WordParser implements BlockParser<WordBlock> {
  constructor (private readonly geometryParser: GeometryParser,
    private readonly blockIdParser: BlockIdParser) {
  }

  process (word: Textract.Block): WordBlock {
    const id = this.blockIdParser(word)
    const geometry = this.geometryParser(word)
    const text = word.Text ?? ''
    return new WordBlock(id, geometry, text)
  }
}
