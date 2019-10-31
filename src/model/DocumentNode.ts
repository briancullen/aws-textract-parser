import { DocumentMetadata, Blocks, Block, PageBlock, Document } from '../types'
import BlockNode from './BlockNode'
import PageBlockNode from './PageBlockNode'

export default class DocumentNode extends BlockNode<Block, PageBlock> implements Document {
  readonly blockType: 'DOCUMENT' = 'DOCUMENT'

  readonly metadata: DocumentMetadata

  constructor (pages: Blocks<PageBlockNode>) {
    super(pages)
    pages.forEach(page => page.setParant(this))
    this.metadata = { pages: pages.length }
  }
}
