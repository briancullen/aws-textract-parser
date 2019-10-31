# AWS Textract Parser
[![Build Status](https://travis-ci.org/briancullen/aws-textract-parser.svg?branch=master)](https://travis-ci.org/briancullen/aws-textract-parser)
[![Maintainability](https://api.codeclimate.com/v1/badges/566b704c4b4d35be1ea9/maintainability)](https://codeclimate.com/github/briancullen/aws-textract-parser/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/566b704c4b4d35be1ea9/test_coverage)](https://codeclimate.com/github/briancullen/aws-textract-parser/test_coverage)

Textract is an AWS service that lets you extract text from pictures or PDF documents. This library was created to process the the response from that service and transform it into something a little more manageable.

> **NOTE**: Currently this library is only setup to deal with responses from the DetectDocumentText calls. Parsing the calls that analyse documents may be added at a later date.

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

The default export from the module is a parser instance that supports two different methods, `handleDetectTextCallback` and `handleDetectTextResponse`.

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

## API
