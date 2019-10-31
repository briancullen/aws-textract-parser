import { Textract } from 'aws-sdk'
import DocumentNode from '../model/DocumentNode'
import { ParserFactory, DocumentFactory } from './Factory'
import PageBlockNode from '../model/PageBlockNode'
import { Document } from '../types'

export class DocumentParser implements DocumentFactory {
  constructor (private readonly pageParserFactory: ParserFactory<PageBlockNode>) { }

  process (input: Textract.DetectDocumentTextResponse): Document {
    if (input.DocumentMetadata?.Pages === undefined) {
      return new DocumentNode([])
    }

    const blocks = input.Blocks ?? []
    const blocksById = blocks.reduce((map, block) => map.set(block.Id as string, block),
      new Map<string, Textract.Block>())

    const parser = this.pageParserFactory(blocksById)
    const pages = blocks.filter(block => block.BlockType === 'PAGE')
      .map(block => parser.process(block))

    return new DocumentNode(pages)
  }
}
