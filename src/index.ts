import { AWSError, Textract } from 'aws-sdk'
import Document from './model/Document'

type ParsedDetectTextCallback = (err: AWSError | null, data: Document | null) => void
type TextractDetectTextCallback = (err: AWSError | null, data: Textract.Types.DetectDocumentTextResponse | null) => void

function parseDetectTextResponse (response: Textract.DetectDocumentTextResponse): Document {
  const pages = response.DocumentMetadata?.Pages === undefined ? 0 : response.DocumentMetadata.Pages
  return new Document(pages, [])
}

function handleDetectTextCallback (callback: ParsedDetectTextCallback): TextractDetectTextCallback {
  return (err, detectTextResponse): void => {
    if (err !== null || detectTextResponse === null) {
      callback(err, null)
    } else {
      callback(null, parseDetectTextResponse(detectTextResponse))
    }
  }
}

export default {
  handleDetectTextCallback,
  parseDetectTextResponse
}
