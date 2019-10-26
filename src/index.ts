import { AWSError, Textract } from 'aws-sdk'

type ParsedDetectTextCallback = (err: AWSError | null, data: object | null) => void
type TextractDetectTextCallback = (err: AWSError | null, data: Textract.Types.DetectDocumentTextResponse | null) => void

function parseDetectTextResponse (response: Textract.DetectDocumentTextResponse): object {
  return { }
}

function handleDetectTextCallback (callback: ParsedDetectTextCallback): TextractDetectTextCallback {
  return (err, detectTextResponse): void => {
    if (err !== null || detectTextResponse === null) {
      callback(err, detectTextResponse)
    } else {
      callback(err, parseDetectTextResponse(detectTextResponse))
    }
  }
}

export default {
  handleDetectTextCallback,
  parseDetectTextResponse
}
