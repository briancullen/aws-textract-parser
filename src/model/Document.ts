import { DocumentMetadata, Blocks } from '../types'
import ParentBlock from './ParentBlock'
import PageBlock from './PageBlock'

export default class Document extends ParentBlock<PageBlock> {
  readonly metadata: DocumentMetadata

  constructor (pages: Blocks<PageBlock>) {
    super(pages)
    this.metadata = { pages: pages.length }
  }
}
