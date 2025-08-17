import { Label, NIP68Event } from '@/types/content'

export interface LabelFilter {
  namespace: Label['namespace']
  values: string[]
  operator: 'AND' | 'OR'
}

export interface LabelQuery {
  filters: LabelFilter[]
  sortBy?: 'count' | 'name' | 'namespace'
  limit?: number
}

export class LabelTaxonomy {
  private labels: Map<string, Label> = new Map()
  private namespaceIndex: Map<string, Set<string>> = new Map()
  private valueIndex: Map<string, Set<string>> = new Map()

  /**
   * Process NIP-68 events and build taxonomy
   */
  processEvents(events: NIP68Event[]): void {
    for (const event of events) {
      if (event.kind === 1985) {
        this.processLabelEvent(event)
      }
    }
  }

  /**
   * Process a single NIP-68 label event
   */
  private processLabelEvent(event: NIP68Event): void {
    try {
      const tags = this.parseTags(event.tags)
      const namespace = tags.get('l')?.[0]
      const value = tags.get('value')?.[0]
      
      if (!namespace || !value) return

      // Validate namespace
      if (!this.isValidNamespace(namespace)) {
        console.warn(`Invalid namespace: ${namespace}`)
        return
      }

      const labelKey = `${namespace}:${value}`
      const existingLabel = this.labels.get(labelKey)
      
      if (existingLabel) {
        existingLabel.count += 1
      } else {
        const newLabel: Label = {
          namespace: namespace as Label['namespace'],
          value,
          count: 1
        }
        this.labels.set(labelKey, newLabel)
        
        // Update indices
        this.addToNamespaceIndex(namespace, labelKey)
        this.addToValueIndex(value, labelKey)
      }
    } catch (error) {
      console.error('Failed to process label event:', error)
    }
  }

  /**
   * Get labels by namespace
   */
  getLabelsByNamespace(namespace: Label['namespace']): Label[] {
    const labelKeys = this.namespaceIndex.get(namespace) || new Set()
    return Array.from(labelKeys)
      .map(key => this.labels.get(key))
      .filter((label): label is Label => label !== undefined)
      .sort((a, b) => b.count - a.count)
  }

  /**
   * Get labels by value (across namespaces)
   */
  getLabelsByValue(value: string): Label[] {
    const labelKeys = this.valueIndex.get(value) || new Set()
    return Array.from(labelKeys)
      .map(key => this.labels.get(key))
      .filter((label): label is Label => label !== undefined)
      .sort((a, b) => b.count - a.count)
  }

  /**
   * Get all labels
   */
  getAllLabels(): Label[] {
    return Array.from(this.labels.values()).sort((a, b) => b.count - a.count)
  }

  /**
   * Get labels matching query
   */
  queryLabels(query: LabelQuery): Label[] {
    let results = this.getAllLabels()

    // Apply filters
    for (const filter of query.filters) {
      if (filter.namespace) {
        results = results.filter(label => label.namespace === filter.namespace)
      }
      
      if (filter.values.length > 0) {
        if (filter.operator === 'AND') {
          results = results.filter(label => filter.values.includes(label.value))
        } else {
          results = results.filter(label => filter.values.some(value => label.value.includes(value)))
        }
      }
    }

    // Apply sorting
    if (query.sortBy) {
      results.sort((a, b) => {
        switch (query.sortBy) {
          case 'count':
            return b.count - a.count
          case 'name':
            return a.value.localeCompare(b.value)
          case 'namespace':
            return a.namespace.localeCompare(b.namespace)
          default:
            return 0
        }
      })
    }

    // Apply limit
    if (query.limit) {
      results = results.slice(0, query.limit)
    }

    return results
  }

  /**
   * Get available namespaces
   */
  getAvailableNamespaces(): Label['namespace'][] {
    const namespaces = new Set<Label['namespace']>()
    Array.from(this.labels.values()).forEach(label => {
      namespaces.add(label.namespace)
    })
    return Array.from(namespaces).sort()
  }

  /**
   * Get available values for a namespace
   */
  getAvailableValues(namespace: Label['namespace']): string[] {
    return this.getLabelsByNamespace(namespace).map(label => label.value)
  }

  /**
   * Build NIP-12 filter for labels
   */
  buildNIP12Filter(filters: LabelFilter[]): any {
    const nip12Filter: any = {}
    
    for (const filter of filters) {
      const tagKey = `#l`
      if (!nip12Filter[tagKey]) {
        nip12Filter[tagKey] = []
      }
      
      for (const value of filter.values) {
        nip12Filter[tagKey].push(`${filter.namespace}:${value}`)
      }
    }
    
    return nip12Filter
  }

  /**
   * Get label statistics
   */
  getStatistics(): {
    totalLabels: number
    totalNamespaces: number
    namespaceCounts: { [key in Label['namespace']]: number }
    topLabels: Label[]
  } {
    const namespaceCounts: { [key in Label['namespace']]: number } = {
      region: 0,
      culture: 0,
      category: 0,
      language: 0,
      type: 0
    }

    Array.from(this.labels.values()).forEach(label => {
      namespaceCounts[label.namespace]++
    })

    return {
      totalLabels: this.labels.size,
      totalNamespaces: this.getAvailableNamespaces().length,
      namespaceCounts,
      topLabels: this.getAllLabels().slice(0, 10)
    }
  }

  /**
   * Clear all labels
   */
  clear(): void {
    this.labels.clear()
    this.namespaceIndex.clear()
    this.valueIndex.clear()
  }

  /**
   * Validate namespace
   */
  private isValidNamespace(namespace: string): namespace is Label['namespace'] {
    const validNamespaces: Label['namespace'][] = ['region', 'culture', 'category', 'language', 'type']
    return validNamespaces.includes(namespace as Label['namespace'])
  }

  /**
   * Add label to namespace index
   */
  private addToNamespaceIndex(namespace: string, labelKey: string): void {
    if (!this.namespaceIndex.has(namespace)) {
      this.namespaceIndex.set(namespace, new Set())
    }
    this.namespaceIndex.get(namespace)!.add(labelKey)
  }

  /**
   * Add label to value index
   */
  private addToValueIndex(value: string, labelKey: string): void {
    if (!this.valueIndex.has(value)) {
      this.valueIndex.set(value, new Set())
    }
    this.valueIndex.get(value)!.add(labelKey)
  }

  /**
   * Parse tags into a Map for easy access
   */
  private parseTags(tags: string[][]): Map<string, string[]> {
    const tagMap = new Map<string, string[]>()
    
    for (const [key, value] of tags) {
      if (!tagMap.has(key)) {
        tagMap.set(key, [])
      }
      tagMap.get(key)!.push(value)
    }
    
    return tagMap
  }
}

// Export singleton instance
export const labelTaxonomy = new LabelTaxonomy()
export default labelTaxonomy
