/**
 * Class represting the position and shape of the recognised block.
 */
export class Geometry {
  /**
   * Provides the coordinates to an axis aligned box that encompasses the
   * block this provides the coordinates for.
   */
  readonly boundaryBox: BoundaryBox

  /**
   * Provides a series of points that describe a polygon that accurately describes
   * the position of the block this provides the coordinates for.
   */
  readonly polygon: Polygon

  /** @ignore */
  constructor (boundaryBox: BoundaryBox, polygon: Polygon) {
    this.boundaryBox = boundaryBox
    this.polygon = polygon
  }
}

/**
 * Class that defines an axis aligned rectangular area on the processed document.
 */
export class BoundaryBox {
  /** @ignore */
  constructor (readonly top: number, readonly left: number, readonly width: number, readonly height: number) {
  }
}

/**
 * Class that represents a point position on the processed document
 */
export class Point {
  /** @ignore */
  constructor (readonly x: number, readonly y: number) {
  }
}

/**
 * Type alias used for an array of Point instances
 */
export type Polygon = Point[]
