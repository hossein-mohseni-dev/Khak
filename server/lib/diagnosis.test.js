import { describe, expect, it } from 'vitest'
import { classifyLocal, hashBytes, mapHfLabel, pickHfTop, buildDiagnosisPayload } from './diagnosis.js'

describe('diagnosis engine', () => {
  it('hashes buffers deterministically', () => {
    const a = Buffer.from('leaf-photo')
    expect(hashBytes(a)).toBe(hashBytes(Buffer.from('leaf-photo')))
    expect(hashBytes(a)).not.toBe(hashBytes(Buffer.from('other')))
  })

  it('uses filename keywords when present', () => {
    const result = classifyLocal(Buffer.from('xxxx'), 'tomato-early-blight.jpg')
    expect(result.label).toBe('Early Blight')
    expect(result.source).toBe('filename-hint')
  })

  it('maps Hugging Face labels', () => {
    expect(mapHfLabel('Tomato___Early_blight')).toBe('Early Blight')
    expect(mapHfLabel('Custom_Label')).toBe('Custom Label')
  })

  it('picks the top HF score', () => {
    const top = pickHfTop([
      { label: 'Tomato___healthy', score: 0.1 },
      { label: 'Tomato___Early_blight', score: 0.92 },
    ])
    expect(top.label).toBe('Early Blight')
    expect(top.source).toBe('huggingface')
  })

  it('builds a payload with confidence', () => {
    const payload = buildDiagnosisPayload({ label: 'Powdery Mildew', score: 0.88, source: 'huggingface' })
    expect(payload.disease.name).toBe('Powdery Mildew')
    expect(payload.confidence).toBe(88)
  })
})
