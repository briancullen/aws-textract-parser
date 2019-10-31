import { Geometry } from './model/Geometry'
import PageBlock from './model/PageBlock'
import LineBlock from './model/LineBlock'
import WordBlock from './model/WordBlock'

export interface CommonBlock {
  readonly id: string
  readonly geometry: Geometry
}

export interface TextProvider {
  readonly text: string
  readonly confidence: number
}

export type Block = PageBlock | LineBlock | WordBlock

export type Blocks<T extends Block> = T[]

export interface DocumentMetadata {
  readonly pages: number
}
