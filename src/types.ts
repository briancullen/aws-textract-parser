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
  TreeNode<LineBlock, Block> {
  readonly blockType: BlockType.Word
}

export interface LineBlock extends BaseBlockProperties, TextProvider,
  TreeNode<PageBlock, WordBlock> {
  readonly blockType: BlockType.Line
}

export interface PageBlock extends BaseBlockProperties,
  TreeNode<Document, LineBlock> {
  readonly blockType: BlockType.Page
}

export interface Document extends TreeNode<Block, PageBlock> {
  readonly blockType: BlockType.Document
  readonly metadata: DocumentMetadata
}

export type Block = Document | PageBlock | LineBlock | WordBlock

export type Blocks<T extends Block> = T[]

export enum BlockType {
  Word = 'WORD',
  Line = 'LINE',
  Page = 'PAGE',
  Document = 'DOCUMENT'
}
