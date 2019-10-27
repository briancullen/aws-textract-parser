import { Block, ParentBlock } from '../api'

export default class TextractParentBlock<T extends Block> implements ParentBlock<T> {
  constructor (private readonly childList: T[]) { }

  get (id: string): T | undefined {
    return this.childList.find(item => item.id === id)
  }

  children (): T[] {
    return [...this.childList]
  }

  hasChild (item: T): boolean {
    return this.childList.includes(item)
  }
}
