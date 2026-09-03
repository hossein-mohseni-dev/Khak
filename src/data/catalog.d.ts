import type { Expert, Product } from '../types'

export const products: Product[]
export const categories: string[]
export const experts: Expert[]
export const specialties: string[]
export const diseases: Array<{
  name: string
  plant: string
  severity: string
  confidenceBase: number
  description: string
  treatment: string
  productIds: number[]
  expertSpecialty: string
  keywords: string[]
}>
export const hfLabelMap: Record<string, string>
export function getDiseaseByName(name: string): (typeof diseases)[number]
export function recommendedProducts(disease: (typeof diseases)[number]): Product[]
