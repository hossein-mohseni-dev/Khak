import type { KhakApi } from './contracts'
import { liveApi } from './live'
import { mockApi } from './mock'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const api: KhakApi = useMock ? mockApi : liveApi
export const apiMode = useMock ? 'mock' : 'live'
