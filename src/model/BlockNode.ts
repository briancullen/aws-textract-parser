import { Block, TreeNode } from '../types'

export default class BlockNode<P extends Block, C extends Block> implements TreeNode<P, C> {
  private parentNode: P | undefined

  constructor (private readonly childList: C[]) { }

  parent (): P | undefined {
    return this.parentNode
  }

  setParant (parent: P): void {
    this.parentNode = parent
  }

  children (): C[] {
    return [...this.childList]
  }

  hasChild (item: C): boolean {
    return this.childList.includes(item)
  }
}
