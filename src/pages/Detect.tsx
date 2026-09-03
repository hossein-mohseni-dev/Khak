import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import { useAuth } from '../state/AuthContext'
import { useToast } from '../state/ToastContext'
import type { Diagnosis } from '../types'
import { hasErrors, validateDiagnosis } from '../utils/validation'

export function Detect() {
  usePageTitle('Disease detection')
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [plant, setPlant] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [field, setField] = useState<Record<string, string | undefined>>({})
  const [status, setStatus] = useState<'idle' | 'busy' | 'done'>('idle')
  const [result, setResult] = useState<Diagnosis | null>(null)
  const [error, setError] = useState('')

  function setChosen(next: File | undefined) {
    if (!next) return
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setResult(null)
    setStatus('idle')
  }

  async function analyze() {
    const next = validateDiagnosis({ file, plant, symptoms })
    setField(next)
    if (hasErrors(next) || !file) return
    if (!user) {
      toast.push('Sign in to run diagnosis.', 'error')
      navigate('/login', { state: { from: '/detect' } })
      return
    }
    setStatus('busy')
    setError('')
    try {
      const data = await api.detect(file, { plant, symptoms })
      setResult(data)
      setStatus('done')
      toast.push('Diagnosis saved to history.')
    } catch (err) {
      setStatus('idle')
      setError(err instanceof Error ? err.message : 'Detection failed')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Disease detection</h1>
      <p className="text-soil-600 dark:text-soil-300 mb-6">Upload a photo, name the plant and describe symptoms.</p>
      {error && <div className="mb-4"><ErrorBanner message={error} onRetry={() => setError('')} /></div>}
      <Card className="p-6 space-y-4 mb-6">
        {!preview ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              setChosen(e.dataTransfer.files[0])
            }}
            className="w-full border-2 border-dashed rounded-xl p-10 text-center"
          >
            Drop a leaf photo or click to upload
          </button>
        ) : (
          <img src={preview} alt="Selected plant" className="max-h-72 mx-auto rounded-xl" />
        )}
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => setChosen(e.target.files?.[0])} />
        {field.file && <p className="text-xs text-red-600">{field.file}</p>}
        <Input label="Plant" placeholder="Tomato, cucumber..." value={plant} onChange={(e) => setPlant(e.target.value)} error={field.plant} />
        <Textarea label="Symptoms" rows={3} placeholder="Yellow spots, white powder..." value={symptoms} onChange={(e) => setSymptoms(e.target.value)} error={field.symptoms} />
        <div className="flex gap-2">
          <Button onClick={analyze} disabled={status === 'busy'}>{status === 'busy' ? 'Analyzing...' : 'Analyze'}</Button>
          <Button variant="secondary" onClick={() => { setFile(null); setPreview(null); setResult(null) }}>Reset</Button>
        </div>
      </Card>
      {result && (
        <Card className="p-6 space-y-3">
          <div className="flex justify-between gap-3">
            <div>
              <p className="text-sm text-soil-500">{result.source}</p>
              <h2 className="text-2xl font-bold">{result.name}</h2>
              <p>on {result.plant}</p>
            </div>
            <p className="text-3xl font-bold text-plant-700">{result.confidence}%</p>
          </div>
          <Badge tone={result.severity === 'Mild' ? 'ok' : result.severity === 'Severe' ? 'bad' : 'warn'}>{result.severity}</Badge>
          <p className="text-sm">{result.description}</p>
          <p className="text-sm bg-plant-50 dark:bg-soil-700 rounded-xl p-3">{result.treatment}</p>
          {result.expert && <Link to={`/experts/${result.expert.id}/consult`} className="text-plant-700 text-sm">Request consult</Link>}
          <Link to="/history" className="text-sm block">Open history</Link>
        </Card>
      )}
    </div>
  )
}
