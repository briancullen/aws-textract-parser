import { Geometry } from './Geometry'
import { Block, LineBlock, WordBlock, BlockType } from '../types'
import BlockNode from './BlockNode'

export default class WordBlockNode extends BlockNode<LineBlock, Block> implements WordBlock {
  readonly blockType: BlockType.Word = BlockType.Word

  constructor (readonly id: string,
    readonly geometry: Geometry,
    readonly text: string,
    readonly confidence: number) {
    super([])
  }
}
