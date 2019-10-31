import { AWSError, Textract } from 'aws-sdk'
import Document from './model/Document'
import documentFactory, { DocumentFactory } from './factory'

type ParsedDetectTextCallback = (err: AWSError | null, data: Document | null) => void
type TextractDetectTextCallback = (err: AWSError | null, data: Textract.Types.DetectDocumentTextResponse | null) => void

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

export default new TextractParser(documentFactory)
