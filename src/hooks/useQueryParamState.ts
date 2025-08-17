'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export interface QueryParamOptions {
  shallow?: boolean
  scroll?: boolean
}

export function useQueryParamState<T extends Record<string, any>>(
  initialState: T,
  options: QueryParamOptions = {}
) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Parse current query params into state
  const currentState = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    const state = { ...initialState }
    
    Object.keys(initialState).forEach(key => {
      const value = params.get(key)
      if (value !== null) {
        // Try to parse as JSON first, fallback to string
        try {
          state[key as keyof T] = JSON.parse(value)
        } catch {
          // Handle different types
          if (typeof initialState[key] === 'boolean') {
            state[key as keyof T] = (value === 'true') as any
          } else if (typeof initialState[key] === 'number') {
            state[key as keyof T] = parseInt(value, 10) as any
          } else if (Array.isArray(initialState[key])) {
            state[key as keyof T] = value.split(',').filter(Boolean) as any
          } else {
            state[key as keyof T] = value as any
          }
        }
      }
    })
    
    return state
  }, [searchParams, initialState])

  // Update query params
  const setQueryParams = useCallback((
    updates: Partial<T> | ((current: T) => Partial<T>)
  ) => {
    const newState = typeof updates === 'function' 
      ? { ...currentState, ...updates(currentState) }
      : { ...currentState, ...updates }
    
    const params = new URLSearchParams()
    
    Object.entries(newState).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && 
          JSON.stringify(value) !== JSON.stringify(initialState[key])) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','))
          }
        } else {
          params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
        }
      }
    })
    
    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    
    router.push(url, { scroll: options.scroll ?? true })
  }, [currentState, initialState, pathname, router, options.scroll])

  // Reset to initial state
  const resetQueryParams = useCallback(() => {
    router.push(pathname, { scroll: options.scroll ?? true })
  }, [pathname, router, options.scroll])

  // Update single param
  const setQueryParam = useCallback((key: keyof T, value: T[keyof T]) => {
    setQueryParams({ [key]: value } as Partial<T>)
  }, [setQueryParams])

  return {
    queryParams: currentState,
    setQueryParams,
    setQueryParam,
    resetQueryParams
  }
}

// Hook for scroll position restoration
export function useScrollRestoration(key: string) {
  const setScrollPosition = useCallback((position: number) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`scroll-${key}`, position.toString())
    }
  }, [key])

  const getScrollPosition = useCallback((): number => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`scroll-${key}`)
      return saved ? parseInt(saved, 10) : 0
    }
    return 0
  }, [key])

  const restoreScrollPosition = useCallback(() => {
    if (typeof window !== 'undefined') {
      const position = getScrollPosition()
      window.scrollTo({ top: position, behavior: 'instant' })
    }
  }, [getScrollPosition])

  return {
    setScrollPosition,
    getScrollPosition,
    restoreScrollPosition
  }
}
