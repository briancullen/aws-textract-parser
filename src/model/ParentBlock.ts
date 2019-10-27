import { Block } from '../types'

export default class ParentBlock<T extends Block> implements ParentBlock<T> {
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
