import { ParserFactory, DocumentFactory } from './Factory'
import PageBlock from '../model/PageBlock'
import WordParser from './WordParser'
import LineParser from './LineParser'
import PageParser from './PageParser'
import { geometryParser, blockIdParser } from './porpertyParsers'
import { DocumentParser } from './DocumentParser'

export const pageParserFactory: ParserFactory<PageBlock> = (blocks) => {
  const wordParser = new WordParser(geometryParser, blockIdParser)
  const lineParser = new LineParser(wordParser, geometryParser, blockIdParser, blocks)
  return new PageParser(lineParser, geometryParser, blockIdParser, blocks)
}

export { DocumentFactory }
export default new DocumentParser(pageParserFactory) as DocumentFactory
