import type { PredictionResult } from '../App'
import AnalyzeForm from './AnalyzeForm'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  result: PredictionResult | null
  loading: boolean
  error: string | null
  onAnalyze: (text: string) => void
}

const sentimentConfig = {
  negative: { color: '#ef4444', emoji: '😠', label: 'Negative' },
  neutral:  { color: '#f59e0b', emoji: '😐', label: 'Neutral' },
  positive: { color: '#22c55e', emoji: '😊', label: 'Positive' },
}

export default function Dashboard({ result, loading, error, onAnalyze }: Props) {
  const chartData = result ? [
    { name: 'Negative', value: Math.round(result.probabilities.negative * 100) },
    { name: 'Neutral',  value: Math.round(result.probabilities.neutral * 100) },
    { name: 'Positive', value: Math.round(result.probabilities.positive * 100) },
  ] : []

  const chartColors = ['#ef4444', '#f59e0b', '#22c55e']
  const config = result ? sentimentConfig[result.sentiment as keyof typeof sentimentConfig] : null

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '42px', fontWeight: '800',
          background: 'linear-gradient(135deg, #6c63ff, #a78bfa, #60a5fa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '12px'
        }}>
          🧠 NLP Sentiment Platform
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Real-time sentiment analysis on airline tweets using Machine Learning
        </p>

        {/* Stats bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '32px',
          marginTop: '28px', flexWrap: 'wrap'
        }}>
          {[
            { label: 'Model', value: 'Linear SVM' },
            { label: 'Accuracy', value: '77.8%' },
            { label: 'Dataset', value: '14,640 Tweets' },
            { label: 'Classes', value: '3 Sentiments' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#1a1a2e', border: '1px solid #2a2a4a',
              borderRadius: '12px', padding: '12px 24px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#a78bfa' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Left - Form */}
        <AnalyzeForm onAnalyze={onAnalyze} loading={loading} />

        {/* Right - Result */}
        <div style={{
          background: '#1a1a2e', borderRadius: '16px',
          padding: '32px', border: '1px solid #2a2a4a',
          display: 'flex', flexDirection: 'column', gap: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#a78bfa' }}>
            📊 Analysis Result
          </h2>

          {error && (
            <div style={{
              background: '#2d1b1b', border: '1px solid #ef4444',
              borderRadius: '10px', padding: '16px', color: '#ef4444'
            }}>
              ⚠️ {error}
            </div>
          )}

          {!result && !loading && !error && (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#4b5563', fontSize: '15px',
              flexDirection: 'column', gap: '12px', minHeight: '200px'
            }}>
              <span style={{ fontSize: '48px' }}>🔮</span>
              <p>Submit a tweet to see the analysis</p>
            </div>
          )}

          {loading && (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#a78bfa', fontSize: '15px',
              flexDirection: 'column', gap: '12px', minHeight: '200px'
            }}>
              <span style={{ fontSize: '48px' }}>⏳</span>
              <p>Analyzing sentiment...</p>
            </div>
          )}

          {result && config && (
            <>
              {/* Sentiment Badge */}
              <div style={{
                background: `${config.color}22`,
                border: `1px solid ${config.color}`,
                borderRadius: '12px', padding: '20px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{config.emoji}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: config.color }}>
                  {config.label}
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
                  Confidence: {Math.round(result.confidence * 100)}%
                </div>
              </div>

              {/* Chart */}
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  Probability Distribution
                </p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                    <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 100]} unit="%" />
                    <Tooltip
                      contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '8px' }}
                      formatter={(value) => [`${value}%`, 'Probability']}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={chartColors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Original text */}
              <div style={{
                background: '#0f0f1a', borderRadius: '10px',
                padding: '14px', border: '1px solid #2a2a4a'
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Analyzed Text:</p>
                <p style={{ fontSize: '14px', color: '#d1d5db', fontStyle: 'italic' }}>"{result.text}"</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '48px', color: '#4b5563', fontSize: '13px' }}>
        Built with Python • FastAPI • React • TypeScript • Docker
      </div>
    </div>
  )
}