import { BoundaryBox } from '../api'

export default class TextractBoundaryBox implements BoundaryBox {
  constructor (readonly top: number, readonly left: number, readonly width: number, readonly height: number) {
  }
}
