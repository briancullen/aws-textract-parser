import { Geometry, Blocks, LineBlock, WordBlock } from '../api'
import TextractParentBlock from './TextractParentBlock'

export default class TextractLineBlock extends TextractParentBlock<WordBlock> implements LineBlock {
  readonly blockType: 'LINE' = 'LINE'

  constructor (readonly id: string, readonly geometry: Geometry, readonly text: string, words: Blocks<WordBlock>) {
    super(words)
  }
}
