import { Document, DocumentMetadata, ParentBlock, PageBlock, Block, Blocks } from '../api'
import TextractParentBlock from './TextractParentBlock'

export default class TextractDocument extends TextractParentBlock<Block> implements Document {
  readonly metadata: DocumentMetadata

  readonly pages: ParentBlock<PageBlock>

  constructor (pages: number, blocks: Blocks<Block>) {
    super(blocks)
    this.metadata = { pages }

    const pageBlocks = blocks.filter(item => item.blockType === 'PAGE') as PageBlock[]
    this.pages = new TextractParentBlock<PageBlock>(pageBlocks)
  }
}
