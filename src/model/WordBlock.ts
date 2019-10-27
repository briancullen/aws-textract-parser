import Geometry from './Geometry'
import { CommonBlock, TextProvider } from '../types'

export default class WordBlock implements CommonBlock, TextProvider {
  readonly blockType: 'WORD' = 'WORD'

  constructor (readonly id: string, readonly geometry: Geometry, readonly text: string) {
  }
}
