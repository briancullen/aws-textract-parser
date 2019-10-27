import { BoundaryBox, Point, Geometry } from '../api'

export default class TextractGeometry implements Geometry {
  constructor (readonly boundaryBox: BoundaryBox, readonly polygon: Point[]) {
  }
}
