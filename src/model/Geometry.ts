import BoundaryBox from './BoundryBox'
import { Polygon } from '../types'

export default class Geometry {
  constructor (readonly boundaryBox: BoundaryBox, readonly polygon: Polygon) {
  }
}
