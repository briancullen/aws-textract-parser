import { Geometry, WordBlock } from '../api'

export default class TextractWordBlock implements WordBlock {
  readonly blockType: 'WORD' = 'WORD'

  constructor (readonly id: string, readonly geometry: Geometry, readonly text: string) {
  }
}
