import ParentBlock from './ParentBlock'
import Geometry from './Geometry'
import WordBlock from './WordBlock'
import { Blocks, CommonBlock, TextProvider } from '../types'

export default class LineBlock extends ParentBlock<WordBlock> implements CommonBlock, TextProvider {
  readonly blockType: 'LINE' = 'LINE'

  constructor (readonly id: string, readonly geometry: Geometry, readonly text: string, words: Blocks<WordBlock>) {
    super(words.sort((a, b) => a.geometry.boundaryBox.left - b.geometry.boundaryBox.left))
  }
}
