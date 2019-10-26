import TextractParser from '../src'
import { Textract, AWSError } from 'aws-sdk'

describe('Should handle textract callback', () => {
  it('Should passthrough error without alteration', (done) => {
    const error = {}
    const callback = TextractParser.handleDetectTextCallback((err, data) => {
      expect(err).toBe(error)
      expect(data).toBeNull()
      done()
    })

    callback(error as AWSError, null)
  })

  it('Should return empty object on parsing', (done) => {
    const result = {}
    const response: Textract.DetectDocumentTextResponse = {
      DocumentMetadata: { Pages: 1 },
      Blocks: []
    }

    const callback = TextractParser.handleDetectTextCallback((err, data) => {
      expect(err).toBeNull()
      expect(data).toEqual(result)
      done()
    })

    callback(null, response)
  })
})

describe('Should handle textract response', () => {
  it('Should return empty object on parsing', () => {
    const expectedResult = {}
    const response: Textract.DetectDocumentTextResponse = {
      DocumentMetadata: { Pages: 1 },
      Blocks: []
    }

    const result = TextractParser.parseDetectTextResponse(response)
    expect(result).toEqual(expectedResult)
  })
})
