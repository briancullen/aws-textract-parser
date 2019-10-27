import { Textract } from 'aws-sdk'
import Document from '../model/Document'
import Point from '../model/Point'
import PageBlock from '../model/PageBlock'
import Geometry from '../model/Geometry'
import LineBlock from '../model/LineBlock'
import BoundaryBox from '../model/BoundryBox'
import WordBlock from '../model/WordBlock'

export default class DocumentFactory {
  process (input: Textract.DetectDocumentTextResponse): Document {
    const pageCount: number = input.DocumentMetadata?.Pages ?? 0
    if (pageCount === 0) {
      return new Document(pageCount, [])
    }

    const blocks = input.Blocks !== undefined ? input.Blocks : []
    const blockMap: Map<string, Textract.Block> = new Map()
    blocks.filter(block => block.Id !== undefined)
      .forEach(block => blockMap.set(block.Id as string, block))

    const pageBlocks = blocks.filter(block => block.BlockType === 'PAGE')
      .map(this.processPage(blockMap))

    const allBlocks = pageBlocks.flatMap(page => {
      const lines = page.children()
      const words = lines.flatMap(child => child.children())
      return [page, ...lines, ...words]
    })

    return new Document(pageCount, allBlocks)
  }

  private processPage (blockMap: Map<string, Textract.Block>): (page: Textract.Block) => PageBlock {
    return page => {
      const children = page.Relationships?.find(relationship => relationship.Type === 'CHILD')?.Ids ?? []
      const lines = children.map(id => blockMap.get(id))
        .filter((block): block is Textract.Block => block !== undefined)
        .filter(block => block.BlockType === 'LINE')
        .map(this.processLine(blockMap))

      const id = this.processId(page)
      const geometry = this.processGeometry(page)
      return new PageBlock(id, geometry, lines)
    }
  }

  private processLine (blockMap: Map<string, Textract.Block>): (line: Textract.Block) => LineBlock {
    return line => {
      const children = line.Relationships?.find(relationship => relationship.Type === 'CHILD')?.Ids ?? []
      const words = children.map(id => blockMap.get(id))
        .filter((block): block is Textract.Block => block !== undefined)
        .filter(block => block.BlockType === 'WORD')
        .map(this.processWord(blockMap))

      const id = this.processId(line)
      const geometry = this.processGeometry(line)
      const text = line.Text ?? ''
      return new LineBlock(id, geometry, text, words)
    }
  }

  private processWord (blockMap: Map<string, Textract.Block>): (line: Textract.Block) => WordBlock {
    return word => {
      const id = this.processId(word)
      const geometry = this.processGeometry(word)
      const text = word.Text ?? ''
      return new WordBlock(id, geometry, text)
    }
  }

  private processGeometry (block: Textract.Block): Geometry {
    const originalBox = block.Geometry?.BoundingBox ?? {}
    const originalPolygon = block.Geometry?.Polygon ?? []

    const box = new BoundaryBox(originalBox.Top ?? -1, originalBox.Left ?? -1,
      originalBox.Width ?? -1, originalBox.Height ?? -1)
    const polygon = originalPolygon.map(point => new Point(point.X ?? -1, point.Y ?? -1))
    return new Geometry(box, polygon)
  }

  private processId (block: Textract.Block): string {
    return block.Id ?? 'unknown'
  }
}
