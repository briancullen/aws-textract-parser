import { DocumentMetadata, Block, Blocks } from '../types'
import ParentBlock from './ParentBlock'
import PageBlock from './PageBlock'

export default class Document extends ParentBlock<Block> {
  readonly metadata: DocumentMetadata

  readonly pages: ParentBlock<PageBlock>

  constructor (pages: number, blocks: Blocks<Block>) {
    super(blocks)
    this.metadata = { pages }

    const pageBlocks = blocks.filter(item => item.blockType === 'PAGE') as PageBlock[]
    this.pages = new ParentBlock<PageBlock>(pageBlocks)
  }
}
