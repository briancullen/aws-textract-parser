import { CommonBlock, Blocks } from '../types'
import ParentBlock from './ParentBlock'
import LineBlock from './LineBlock'
import Geometry from './Geometry'

export default class PageBlock extends ParentBlock<LineBlock> implements CommonBlock {
  readonly blockType: 'PAGE' = 'PAGE'

  constructor (readonly id: string, readonly geometry: Geometry, lines: Blocks<LineBlock>) {
    super(lines)
  }
}
