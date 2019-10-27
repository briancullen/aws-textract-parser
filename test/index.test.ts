import TextractParser from '../src'
import { AWSError } from 'aws-sdk'

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

  it('Should return document on parsing', (done) => {
    const response = {
      DocumentMetadata: { Pages: 1 },
      Blocks: []
    }

    const callback = TextractParser.handleDetectTextCallback((err, data) => {
      expect(err).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.metadata.pages).toEqual(response.DocumentMetadata.Pages)
      expect(data?.children()).toEqual(response.Blocks)
      done()
    })

    callback(null, response)
  })
})

describe('Should handle textract response', () => {
  it('Should return document object on parsing', () => {
    const response = {
      DocumentMetadata: { Pages: 1 },
      Blocks: []
    }

    const result = TextractParser.parseDetectTextResponse(response)
    expect(result.metadata.pages).toEqual(response.DocumentMetadata.Pages)
    expect(result.children()).toEqual(response.Blocks)
  })

  it('Should handle empty metadata', () => {
    const response = {
      Blocks: []
    }

    const result = TextractParser.parseDetectTextResponse(response)
    expect(result.metadata.pages).toEqual(0)
    expect(result.children()).toEqual(response.Blocks)
  })
})
