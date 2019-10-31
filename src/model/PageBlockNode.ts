import { PageBlock, LineBlock, Document } from '../types'
import BlockNode from './BlockNode'
import { Geometry } from './Geometry'
import LineBlockNode from './LineBlockNode'

export default class PageBlockNode extends BlockNode<Document, LineBlock> implements PageBlock {
  readonly blockType: 'PAGE' = 'PAGE'

  constructor (readonly id: string, readonly geometry: Geometry, lines: LineBlockNode[]) {
    super(lines)
    lines.forEach(line => line.setParant(this))
  }
}
