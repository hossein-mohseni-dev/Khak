import { useCallback, useEffect, useState } from 'react'

export function useAsync<T>(loader: () => Promise<T>): {
  data: T | null
  error: string
  loading: boolean
  reload: () => void
  setData: (value: T | ((prev: T | null) => T | null)) => void
} {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = useCallback(() => {
    setLoading(true)
    setError('')
    loader()
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Request failed'))
      .finally(() => setLoading(false))
  }, [loader])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, error, loading, reload, setData }
}
