import { ParserFactory, DocumentFactory } from './Factory'
import PageBlockNode from '../model/PageBlockNode'
import WordParser from './WordParser'
import LineParser from './LineParser'
import PageParser from './PageParser'
import { geometryParser, blockIdParser } from './porpertyParsers'
import { DocumentParser } from './DocumentParser'

export const pageParserFactory: ParserFactory<PageBlockNode> = (blocks) => {
  const wordParser = new WordParser(geometryParser, blockIdParser)
  const lineParser = new LineParser(wordParser, geometryParser, blockIdParser, blocks)
  return new PageParser(lineParser, geometryParser, blockIdParser, blocks)
}

export { DocumentFactory }
export default new DocumentParser(pageParserFactory) as DocumentFactory
