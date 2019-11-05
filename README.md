# AWS Textract Parser
[![Build Status](https://travis-ci.org/briancullen/aws-textract-parser.svg?branch=master)](https://travis-ci.org/briancullen/aws-textract-parser)
[![Maintainability](https://api.codeclimate.com/v1/badges/566b704c4b4d35be1ea9/maintainability)](https://codeclimate.com/github/briancullen/aws-textract-parser/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/566b704c4b4d35be1ea9/test_coverage)](https://codeclimate.com/github/briancullen/aws-textract-parser/test_coverage)

Textract is an AWS service that lets you extract text from pictures or PDF documents. This library was created to process the the response from that service and transform it into something a little more manageable.

> **NOTE**: Currently this library is only setup to deal with responses from the DetectDocumentText calls, either synchronous or asynchronous. Parsing the calls that analyse documents may be added at a later date.

## Rationale
Textract returns json representing the pages, lines and words it has detected in the input. Below is a simplified example of the data you could expect for a single line of text consisting of two words. As you can see the data describes a tree where the line is identified as a child of the page and the words as children of the line.

```json
{
  "DocumentMetaData": {
    "Pages": 1
  },
  "Blocks": [
    {
      "Id": "1",
      "BlockType": "PAGE",
      "Relationships": [{
        "Type": "CHILD",
        "Ids": [ "2" ]
      }]
    },
    { 
      "Id": "1",
      "BlockType": "LINE",
      "Relationships": [{
        "Type": "CHILD",
        "Ids": [ "3", "4" ]
      }]
    },
    { "Id": "3", "BlockType": "WORD" },
    { "Id": "4", "BlockType": "WORD" }
  ]
}
```

Unfortunately this tree structure is flattened into a array which makes navigating it more awkward that it should be. The purpose of this library is to process this flattened json to provide the tree structure described by it.

> In some tests the order of the words related to a line did not match that of the text. This is not what you would expect from processing a document. To address this the library will sort the words into left to right order (based on their position on the page).

## Usage

The default export from the module is a parser instance that supports three different methods, `handleDetectTextCallback`, `handleDetectTextResponse`, and `parseGetTextDetection`.

`handleDetectTextCallback` is a helper method that can be passed in as the standard callback to the Textract method. In turn it will call another callback with the processed tree. An example of this type of usage is shown below.

```typescript
import { Textract } from 'aws-sdk'
import textractParser from '<TBD>'

const textract = new Textract()
const myCallback = (err, data) => {
  if(err) {
    console.log(err)
  } else {
    console.log(data)
  }
}

const request = {
  Document: {
    S3Object: {
      Bucket: "your-s3-bucket",
      Name: "your-object-key"
    }
  }
}

textract.detectDocumentText(request,
  textractParser.handleDetectTextCallback(myCallback))
```

`handleDetectTextResponse` will take a value of type `Textract.DetectDocumentTextResponse` and process it synchronously. This can be used with the promises provided by the AWS SDK. An example of how to use it in this manner is shown below.

```typescript
textract.detectDocumentText(request).promise()
  .then(data => textractParser.parseDetectTextResponse(data))
  .then(parsedData => console.log(parsedData))
  .catch(err => console.log(err))
```

`parseGetTextDetection` is a helper method to be used with the GetDocumentTextDetection operation. This operation can return the processed information over multiple requests which causes a problem when trying to construct the complete tree. If all the results are returned in a single response then the `handleDetectTextResponse` can be used as shown above.

However, if that is not the case, then this call can be used to retrieve all the data and construct the tree as shown below. To allow the SDK to be configured differently in different environments a instantiated Textract client must be provided to this method.

```typescript
const jobId = 'your-job-id'
const client = new AWS.Textract()

textract.detectDocumentText(client, jobId)
 .then(parsedData => console.log(parsedData))
 .catch(err => console.log(err))
```

**NOTE** This method will load the entire set of results into memory which may cause issues for really large documents. To give some context for a 10 page document of text the size of the results returned from textract was in the region of 7MB.

## API
See the [API Docs](https://briancullen.github.io/aws-textract-parser/) for more information.

In particular refer to the API for the Document class as this forms the root of the tree that is returned.
