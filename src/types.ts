import { Geometry } from './model/Geometry'

interface BaseBlockProperties {
  readonly id: string
  readonly geometry: Geometry
}

interface TextProvider {
  readonly text: string
  readonly confidence: number
}

export interface TreeNode<P extends Block, C extends Block> {
  parent(): P | undefined

  children(): C[]

  hasChild (item: C): boolean
}

export interface DocumentMetadata {
  readonly pages: number
}
export interface WordBlock extends BaseBlockProperties, TextProvider,
  TreeNode<LineBlock, Block> { }

export interface LineBlock extends BaseBlockProperties, TextProvider,
  TreeNode<PageBlock, WordBlock> { }

export interface PageBlock extends BaseBlockProperties,
  TreeNode<Document, LineBlock> { }

export interface Document extends TreeNode<Block, PageBlock> {
  readonly metadata: DocumentMetadata
}

export type Block = Document | PageBlock | LineBlock | WordBlock

export type Blocks<T extends Block> = T[]
