import { Geometry } from './model/Geometry'

/**
 * Interface that descibes the properties implemented
 * by all blocks with the exception of the document block type.
 */
export interface BaseBlockProperties {
  /** Unique id used to identify a block */
  readonly id: string

  /** Location information identifying where the block can be found */
  readonly geometry: Geometry
}

/**
 * Interface that is implemented by blocks that include
 * recognised text.
 */
export interface TextProvider {
  /** The text recognised for this block */
  readonly text: string

  /** The confidence (as a precentage) that the text has
   * been identified correctly
   */
  readonly confidence: number
}

/**
 * Interface implemented by all nodes that make up the parsed tree.
 * @typeparam P type of the parent of this node
 * @typeparam C type of the children of this node
 */
export interface TreeNode<P extends Block, C extends Block> {
  /**
   * Get the parent node of this node
   * @returns the parent of this node or undefined if this is the root node
   */
  parent(): P | undefined

  /**
   * Gets the children of this node
   * @returns an array of children or an empty array if this is a leaf node
   */
  children(): C[]

  /**
   * Determines whether or not the specified node is a child of this node.
   * @param item the item to look for
   * @returns true if the item is a child of this node, false otherwise
   */
  hasChild (item: C): boolean
}

/**
 * Interface describing information made available about the document
 * that has been processed. Currently only one piece of information
 * is provided.
 */
export interface DocumentMetadata {
  /** Number of pages in the processed document */
  readonly pages: number
}

/**
 * Interface that provides access to information about Word blocks.
 * If present word blocks are always the leaves of the tree, that is
 * they never have any child node.
 *
 * In the current implementation the parent of a Word block is
 * always a line block.
 */
export interface WordBlock extends BaseBlockProperties, TextProvider,
  TreeNode<LineBlock, Block> {
  /**
   * Constant indicating the type of Block. Can be used for type descrimination,
   * see [[BlockType]] for more details.
   */
  readonly blockType: BlockType.Word
}

/**
 * Interface that provides access to information about Line blocks.
 * Line blocks are always children of the Page block and represent a
 * single line of text in the processed document.
 *
 * The line is further split into words what are made into Word
 * blocks and are added as children to a Line block.
 */
export interface LineBlock extends BaseBlockProperties, TextProvider,
  TreeNode<PageBlock, WordBlock> {
  /**
   * Constant indicating the type of Block. Can be used for type descrimination,
   * see [[BlockType]] for more details.
   */
  readonly blockType: BlockType.Line
}

/**
 * Interface that provides access to information about Page blocks.
 * Page blocks act as the root of all information processed from
 * a single page in the document. The parent of the Page block is
 * always a document block.
 *
 * Pages are broken down into a number of lines. The line blocks
 * that are created to represent these lines form the children
 * of a page block.
 */
export interface PageBlock extends BaseBlockProperties,
  TreeNode<Document, LineBlock> {
  /**
   * Constant indicating the type of Block. Can be used for type descrimination,
   * see [[BlockType]] for more details.
   */
  readonly blockType: BlockType.Page
}

/**
 * Interface that provides access to information about Document blocks.
 * The Document block always forms the root of the tree and there is
 * only one Document block per Textract response.
 *
 * The Document block will have one Page block child for each page
 * in the processed document.
 */
export interface Document extends TreeNode<Block, PageBlock> {
  /**
   * Constant indicating the type of Block. Can be used for type descrimination,
   * see [[BlockType]] for more details.
   */
  readonly blockType: BlockType.Document

  /** Provides metadata regarding the processed document */
  readonly metadata: DocumentMetadata
}

/** Union type for all the different possible block types */
export type Block = Document | PageBlock | LineBlock | WordBlock

/**
 * Type alias used as shorthand for an array of block of a particular type.
 * @typeparam T the type of block to be stored in the array
 */
export type Blocks<T extends Block> = T[]

/**
 * Enum used to identify the different types of block that can
 * be in the returned tree
 */
export enum BlockType {
  /** Indicates a Word Block */
  Word = 'WORD',

  /** Indicates a Line Block */
  Line = 'LINE',

  /** Indicates a Page Block */
  Page = 'PAGE',

  /** Indicates a Document Block */
  Document = 'DOCUMENT'
}
