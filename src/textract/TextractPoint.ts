import { Point } from '../api'

export default class TextractPoint implements Point {
  constructor (readonly x: number, readonly y: number) {
  }
}
