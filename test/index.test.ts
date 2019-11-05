import textractParser from '../src'
import { AWSError, Textract } from 'aws-sdk'
import each from 'jest-each'

describe('Should handle textract callback', () => {
  it('Should passthrough error without alteration', (done) => {
    // Given
    const error = {}
    const callback = textractParser.parseDetectTextCallback((err, data) => {
      // Then
      expect(err).toBe(error)
      expect(data).toBeNull()
      done()
    })

    // When
    callback(error as AWSError, null)
  })

  it('Should return document on parsing', (done) => {
    // Given
    const response = {
      DocumentMetadata: { Pages: 1 },
      Blocks: []
    }

    const callback = textractParser.parseDetectTextCallback((err, data) => {
      // Then
      expect(err).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.metadata.pages).toEqual(0)
      expect(data?.children()).toEqual([])
      done()
    })

    // When
    callback(null, response)
  })
})

describe('Should handle textract response', () => {
  it('Should return null if NextToken present', () => {
    // Given
    const response = {
      DocumentMetadata: { Pages: 1 },
      Blocks: [],
      NextToken: 'asdfasdfasdfasd'
    }

    // When
    const result = textractParser.parseDetectTextResponse(response)

    // Then
    expect(result).toBeNull()
  })

  it('Should return document object on parsing', () => {
    // Given
    const response = {
      DocumentMetadata: { Pages: 1 },
      Blocks: []
    }

    // When
    const result = textractParser.parseDetectTextResponse(response)

    // Then
    expect(result).toBeDefined()
    expect(result?.metadata.pages).toEqual(0)
    expect(result?.children()).toEqual([])
  })

  it('Should handle empty metadata', () => {
    // Given
    const response = {
      Blocks: []
    }

    // When
    const result = textractParser.parseDetectTextResponse(response)

    // Then
    expect(result?.metadata.pages).toEqual(0)
    expect(result?.children()).toEqual([])
  })
})

describe('Should handle get text detection', () => {
  const jobId = '123456781234567'

  each(['IN_PROGRESS', 'FAILED', 'PARTIAL_SUCCESS']).it('Should fail if job status is %s', async (status) => {
    const client: Textract = ({
      getDocumentTextDetection: jest.fn(request => {
        expect(request.JobId).toEqual(jobId)
        expect(request.NextToken).toBeUndefined()
        return { promise: async () => Promise.resolve({ JobStatus: status }) }
      })
    } as unknown) as Textract

    return textractParser.parseGetTextDetection(client, jobId)
      .then(document => fail())
      .catch(error => {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual(`Job status is ${status} only SUCCEEDED jobs can be processed`)
      })
  })

  it('should return AWS error to caller', async () => {
    const error = new Error('some message')
    const client: Textract = ({
      getDocumentTextDetection: jest.fn(request => {
        expect(request.JobId).toEqual(jobId)
        expect(request.NextToken).toBeUndefined()
        return { promise: async () => Promise.reject(error) }
      })
    } as unknown) as Textract

    return textractParser.parseGetTextDetection(client, jobId)
      .then(document => fail())
      .catch(error => {
        expect(error).toBe(error)
      })
  })

  it('should process response requiring multiple requests', async () => {
    const responses = [
      { DocumentMetadata: { Pages: 3 }, NextToken: '1', JobStatus: 'SUCCEEDED' },
      {
        DocumentMetadata: { Pages: 3 },
        NextToken: '2',
        JobStatus: 'SUCCEEDED',
        Blocks: [{ Id: '1234123412', BlockType: 'PAGE' }, { Id: '1123423412', BlockType: 'PAGE' }]
      },
      { DocumentMetadata: { Pages: 3 }, JobStatus: 'SUCCEEDED' }
    ]

    const pageIds = responses[1].Blocks?.map(block => block.Id)
    const client: Textract = ({
      getDocumentTextDetection: jest.fn(request => {
        expect(request.JobId).toEqual(jobId)
        return { promise: async () => Promise.resolve(responses.shift()) }
      })
    } as unknown) as Textract

    return textractParser.parseGetTextDetection(client, jobId)
      .then(document => {
        expect(document).toBeDefined()
        expect(document.metadata.pages).toEqual(2)
        document.children().forEach(child => expect(pageIds).toContainEqual(child.id))
      })
  })
})
