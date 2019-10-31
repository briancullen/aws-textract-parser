import { Textract } from 'aws-sdk'
import Document from '../model/Document'
import { ParserFactory, DocumentFactory } from './Factory'
import PageBlock from '../model/PageBlock'

export class DocumentParser implements DocumentFactory {
  constructor (private readonly pageParserFactory: ParserFactory<PageBlock>) { }

  process (input: Textract.DetectDocumentTextResponse): Document {
    if (input.DocumentMetadata?.Pages === undefined) {
      return new Document([])
    }

    const blocks = input.Blocks ?? []
    const blocksById = blocks.reduce((map, block) => map.set(block.Id as string, block),
      new Map<string, Textract.Block>())

    const parser = this.pageParserFactory(blocksById)
    const pages = blocks.filter(block => block.BlockType === 'PAGE')
      .map(block => parser.process(block))

    return new Document(pages)
  }
}
