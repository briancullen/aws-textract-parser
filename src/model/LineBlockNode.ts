import BlockNode from './BlockNode'
import { Geometry } from './Geometry'
import { LineBlock, PageBlock, WordBlock, BlockType } from '../types'
import WordBlockNode from './WordBlockNode'

export default class LineBlockNode extends BlockNode<PageBlock, WordBlock> implements LineBlock {
  readonly blockType: BlockType.Line = BlockType.Line

  constructor (readonly id: string,
    readonly geometry: Geometry,
    readonly text: string,
    readonly confidence: number,
    words: WordBlockNode[]) {
    super(words.sort((a, b) => a.geometry.boundaryBox.left - b.geometry.boundaryBox.left))
    words.forEach(word => word.setParant(this))
  }
}
