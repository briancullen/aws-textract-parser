import { AWSError, Textract } from 'aws-sdk'
import documentFactory, { DocumentFactory } from './factory'
import { Document } from './types'

/**
 * Callback signature to be implemented by code wishing to use callbacks to process
 * the data returned by Textract.
 */
export type ParsedDetectTextCallback = (err: AWSError | null, data: Document | null) => void

/**
 * Callback signature used by AWS to return data from Textract.
 */
export type TextractDetectTextCallback = (err: AWSError | null,
  data: Textract.Types.DetectDocumentTextResponse | null) => void

/**
 * This class provides methods to process the information returned by Textract into
 * a tree structure that is easier to work with.
 *
 * A single instance of this class is automatically created for you and provided as
 * the default export from this library.
 */
export class TextractParser {
  /** @hidden */
  constructor (private readonly factory: DocumentFactory) { }

  /**
   * Method that parses the textract response synchronously. It can also be used
   * as part of processing the result of a promise as shown.
   *
   * ```typescript
   * textract.detectDocumentText(request).promise()
   * .then(data => textractParser.parseDetectTextResponse(data))
   * .then(parsedData => console.log(parsedData))
   * .catch(err => console.log(err))
   * ```
   *
   * @param response the response object returned from Textract
   * @returns Document that acts as the root node for the processed tree
   */
  parseDetectTextResponse (response: Textract.DetectDocumentTextResponse): Document {
    return this.factory.process(response)
  }

  /**
   * Method that acts as a proxy for the standard Textract callback. This proxy will process
   * the data returned by Textract and call the provided callback with the processed information.
   * It can be invoked as shown, where myCallback is written by the user of the library.
   *
   * ```typescript
   * textract.detectDocumentText(request, textractParser.handleDetectTextCallback(myCallback))
   * ```
   *
   * @param callback the callback to be invoked with the processed data or error
   * @returns callback function that can be used with the AWS Textract invocation
   */
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

export {
  Document,
  PageBlock,
  LineBlock,
  WordBlock,
  Block,
  Blocks,
  BlockType,
  DocumentMetadata
} from './types'

export { Geometry, BoundaryBox, Polygon, Point } from './model/Geometry'
export default new TextractParser(documentFactory)
