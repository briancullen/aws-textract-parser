export class Geometry {
  constructor (readonly boundaryBox: BoundaryBox, readonly polygon: Polygon) {
  }
}

export class BoundaryBox {
  constructor (readonly top: number, readonly left: number, readonly width: number, readonly height: number) {
  }
}

export class Point {
  constructor (readonly x: number, readonly y: number) {
  }
}

export type Polygon = Point[]
