interface CommonBlock {
  readonly id: string
  readonly geometry: Geometry
}

export interface ParentBlock<T extends Block> {
  get(id: string): T | undefined
  children(): Blocks<T>
  hasChild(item: T): boolean
}

interface TextProvider {
  readonly text: string
}

export type Block = PageBlock | LineBlock | WordBlock

export type Blocks<T extends Block> = T[]

export interface Geometry {
  boundaryBox: BoundaryBox
  polygon: Polygon
}

export interface BoundaryBox {
  top: number
  left: number
  width: number
  height: number
}

export type Polygon = Point[]

export interface Point {
  x: number
  y: number
}

export interface PageBlock extends CommonBlock, ParentBlock<LineBlock> {
  readonly blockType: 'PAGE'
}

export interface LineBlock extends CommonBlock, ParentBlock<WordBlock>, TextProvider {
  readonly blockType: 'LINE'
}

export interface WordBlock extends CommonBlock, TextProvider {
  readonly blockType: 'WORD'
}
