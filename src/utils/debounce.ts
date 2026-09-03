export function debounce<T extends (...args: never[]) => void>(fn: T, wait = 250): T {
  let timer: ReturnType<typeof setTimeout> | undefined
  const wrapped = ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }) as T
  return wrapped
}

export function useDebounceDelay(): number {
  return 280
}
