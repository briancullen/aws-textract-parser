import { Textract } from 'aws-sdk'
import { Geometry, Point, BoundaryBox } from '../model/Geometry'

export function geometryParser (block: Textract.Block): Geometry {
  const originalBox = block.Geometry?.BoundingBox ?? {}
  const originalPolygon = block.Geometry?.Polygon ?? []

  const box = new BoundaryBox(originalBox.Top ?? -1, originalBox.Left ?? -1,
    originalBox.Width ?? -1, originalBox.Height ?? -1)
  const polygon = originalPolygon.map(point => new Point(point.X ?? -1, point.Y ?? -1))
  return new Geometry(box, polygon)
}

export function blockIdParser (block: Textract.Block): string {
  return block.Id ?? 'unknown'
}
