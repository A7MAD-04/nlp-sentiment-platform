import { useState } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'

export type PredictionResult = {
  text: string
  sentiment: string
  confidence: number
  probabilities: {
    negative: number
    neutral: number
    positive: number
  }
}

function App() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (text: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post('http://localhost:8000/predict', { text })
      setResult(response.data)
    } catch {
      setError('API is not running. Please start Docker first.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a' }}>
      <Dashboard result={result} loading={loading} error={error} onAnalyze={handleAnalyze} />
    </div>
  )
}

export default App