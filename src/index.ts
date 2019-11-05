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
 * Unified type to accept responses from either the synchronous or asynchronous detect text operations.
 */
export type TextractDetectTextResponse = Textract.DetectDocumentTextResponse & Textract.GetDocumentTextDetectionResponse

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
   * Method that parses the textract response synchronously. 
   *
   * For example it can also be used as part of processing the result of a promise
   * as shown below.
   *
   * ```typescript
   * textract.detectDocumentText(request).promise()
   * .then(data => textractParser.parseDetectTextResponse(data))
   * .then(parsedData => console.log(parsedData))
   * .catch(err => console.log(err))
   * ```
   *
   * **NOTE**: If used to process GetDocumentTextDetectionResponse response then all data should be
   * contained within a single response. If a NextToken is detected on the response then null will
   * be returned. See [[parseGetTextDetection]] for a helper method which will aggregate the
   * responses from the GetDocumentTextDetection operation.
   *
   * @param response the response object returned from Textract or null if the response is incomplete
   * @returns Document that acts as the root node for the processed tree
   */
  parseDetectTextResponse (response: TextractDetectTextResponse): Document | null {
    if (response.NextToken !== undefined) {
      return null
    }

    return this.factory.process(response)
  }

  /**
   * Method that acts as a proxy for the standard Textract callback.
   *
   * This proxy will process the data returned by Textract and call the provided callback
   * with the processed information. It can be invoked as shown, where myCallback is written
   * by the user of the library.
   *
   * ```typescript
   * textract.detectDocumentText(request, textractParser.parseDetectTextCallback(myCallback))
   * ```
   *
   * @param callback the callback to be invoked with the processed data or error
   * @returns callback function that can be used with the AWS Textract invocation
   */
  parseDetectTextCallback (callback: ParsedDetectTextCallback): TextractDetectTextCallback {
    return (err, detectTextResponse): void => {
      if (err !== null || detectTextResponse === null) {
        callback(err, null)
      } else {
        callback(null, this.parseDetectTextResponse(detectTextResponse))
      }
    }
  }

  /**
   * Method that retrieves the result of a asynchronous document text detection operation
   * (which may require multiple requests to AWS) and produces a tree of the results.
   * 
   * An example of how to use this method is shown below.
   *
   * ```typescript
   * const jobId = 'your-job-id'
   * const client = new AWS.Textract()
   * 
   * textract.detectDocumentText(client, jobId)
   *  .then(parsedData => console.log(parsedData))
   *  .catch(err => console.log(err))
   * ```
   *
   * If the specified Textract job is not marked as SUCCEEDED or the AWS operations fail
   * to return the results then the Promise will be rejected.
   *
   * **NOTE**: This method will try and retrieve all the results for the Textract job and
   * process them in memory. For extremely large documents then memory may become an issue.
   *
   * @param client the AWS client to use for retrieving the Textract results
   * @param jobId the id of the Textract job for which we want to parse the results
   * @returns Promise for a document that acts as the root node for the processed tree
   */
  async parseGetTextDetection (textract: Textract, jobId: string): Promise<Document> {
    return this.getGetTextDetectionResponse(textract, jobId)
      .then(request => this.factory.process(request))
  }

  /** @hidden */
  private async getGetTextDetectionResponse (textract: Textract,
    jobId: string, nextToken?: string): Promise<TextractDetectTextResponse> {
    return textract.getDocumentTextDetection({ JobId: jobId, NextToken: nextToken }).promise()
      .then(response => {
        if (response.JobStatus !== 'SUCCEEDED') {
          throw new Error(`Job status is ${response.JobStatus} only SUCCEEDED jobs can be processed`)
        } else if (response.NextToken !== undefined) {
          return this.getGetTextDetectionResponse(textract, jobId, response.NextToken)
            .then(otherResponse => {
              return {
                DocumentMetadata: response.DocumentMetadata,
                Blocks: (response.Blocks ?? []).concat(otherResponse.Blocks ?? [])
              }
            })
        } else {
          return response
        }
      })
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
