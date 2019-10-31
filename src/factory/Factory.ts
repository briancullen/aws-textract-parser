import { Block, Document } from '../types'
import { Textract } from 'aws-sdk'
import { Geometry } from '../model/Geometry'

export type ParserFactory<T extends Block> = (blocks: Map<string, Textract.Block>) => BlockParser<T>

export type GeometryParser = (geomtery: Textract.Block) => Geometry

export type BlockIdParser = (block: Textract.Block) => string

export interface BlockParser<T extends Block> {
  process (block: Textract.Block): T
}

export interface DocumentFactory {
  process (blocks: Textract.DetectDocumentTextResponse): Document
}
