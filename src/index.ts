import { AWSError, Textract } from 'aws-sdk'
import documentFactory, { DocumentFactory } from './factory'
import { Document } from './types'

export type ParsedDetectTextCallback = (err: AWSError | null, data: Document | null) => void
export type TextractDetectTextCallback = (err: AWSError | null,
  data: Textract.Types.DetectDocumentTextResponse | null) => void

export class TextractParser {
  constructor (private readonly factory: DocumentFactory) { }

  parseDetectTextResponse (response: Textract.DetectDocumentTextResponse): Document {
    return this.factory.process(response)
  }

  handleDetectTextCallback (callback: ParsedDetectTextCallback): TextractDetectTextCallback {
    return (err, detectTextResponse): void => {
      if (err !== null || detectTextResponse === null) {
        callback(err, null)
      } else {
        callback(null, this.parseDetectTextResponse(detectTextResponse))
      }
    }
  }
}

export { Document, PageBlock, LineBlock, WordBlock, Block, Blocks, DocumentMetadata } from './types'
export { Geometry, BoundaryBox, Polygon, Point } from './model/Geometry'
export default new TextractParser(documentFactory)
