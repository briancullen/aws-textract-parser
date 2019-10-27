import { PageBlock, Geometry, Blocks, LineBlock } from '../api'
import TextractParentBlock from './TextractParentBlock'

export default class TextractPageBlock extends TextractParentBlock<LineBlock> implements PageBlock {
  readonly blockType: 'PAGE' = 'PAGE'

  constructor (readonly id: string, readonly geometry: Geometry, lines: Blocks<LineBlock>) {
    super(lines)
  }
}
